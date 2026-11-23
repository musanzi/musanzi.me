---
title: "Construire : implémenter test d'abord"
description: "Construire un ticket avec implement, une spécification entière avec implement-spec, piloter le code par les tests avec tdd et diagnostiquer les bugs difficiles."
course: workflow-claude-code
order: 6
---

Une fois les tickets publiés, la construction devient presque mécanique. C'est voulu : les décisions ont été prises avant, et l'agent qui implémente peut consacrer sa fenêtre de contexte au code.

| Skill | Quand l'utiliser | Manuel / auto |
| --- | --- | --- |
| `implement` | un ticket, ou un petit changement dans la session en cours | manuel |
| `implement-spec` | toute une spécification, avec des sous-agents en parallèle | manuel |
| `tdd` | construire un comportement test d'abord | auto |
| `diagnosing-bugs` | un bug qui résiste, un test instable, une régression | auto |

## `/implement` : un ticket à la fois

`/implement` construit le travail décrit dans une spécification ou des tickets. Le skill est court, et chaque ligne compte :

1. Si vous lui passez une référence de ticket, il la récupère sur le gestionnaire et annonce son titre avant de commencer. Si la référence est ambiguë, il demande.
2. Il charge les skills de la pile qui correspondent à la partie du code touchée (voir plus bas).
3. Il construit avec `tdd` partout où c'est possible, aux coutures convenues.
4. Il lance la vérification de types et les fichiers de test concernés régulièrement, et toute la suite de tests une fois à la fin.
5. Il appelle `spec-review` pour relire son travail.
6. Il commite sur la branche courante.

En pratique, pour un chantier sur plusieurs sessions, je lance :

```text
/implement #128
```

puis, une fois le ticket terminé, `/clear` et le ticket suivant de la frontière. Chaque ticket se suffit à lui-même, donc rien ne se perd. Pour un petit changement, je lance `/implement` directement après l'interrogatoire, dans la même fenêtre : l'agent a encore tout le raisonnement sous les yeux.

## `/implement-spec` : toute la spécification en parallèle

`/implement-spec` prend une spécification et ses tickets, et vise un résultat : toute la spécification implémentée sur une seule **branche d'intégration**, chaque ticket fermé selon les règles du gestionnaire.

### Le graphe de tâches

Les tickets ne sont pas une liste d'étapes. Ce sont les nœuds d'un **graphe de tâches** (*task graph*), reliés par les bords bloquants. À tout moment, une frontière de tickets est prête à être prise, et c'est elle qui fixe le degré de parallélisme.

### Le déroulement

1. L'agent lit la spécification et les tickets pour comprendre le graphe.
2. Optionnellement, un **sous-agent d'exploration** lit le code et la documentation externe, et range ses notes en Markdown dans un répertoire hors du dépôt, accessible à tous les sous-agents suivants.
3. L'agent crée la branche d'intégration. Si votre gestionnaire ferme le travail par des pull requests, il ouvre une pull request en brouillon après la première fusion.
4. Pour chaque ticket de la frontière, un **sous-agent d'implémentation** démarre, avec un contexte vierge, dans son propre *worktree* git et sur sa propre branche. Il vérifie qu'il part bien de la branche d'intégration, construit le ticket avec `tdd`, puis fusionne la pointe de la branche d'intégration dans la sienne avant de rendre la main.
5. Un **sous-agent de fusion** intègre son travail à la branche d'intégration.
6. Si la frontière s'élargit, l'agent lance de nouveaux sous-agents d'implémentation.
7. Quand tous les tickets sont faits, il lance `spec-review` sur la branche d'intégration, puis corrige tous les retours dans un seul sous-agent neuf.
8. Il passe la pull request en « prête pour relecture », ou ferme chaque ticket et vous indique la branche.
9. Il nettoie les *worktrees*.

Les sous-agents d'implémentation tournent en arrière-plan quand c'est possible. Ils communiquent peu, et surtout par pointeurs de contexte : un lien vers la spécification, un ticket, une note d'exploration, un commit. Rien n'est recopié qui soit déjà accessible par un pointeur.

### `/implement` ou `/implement-spec` ?

Je prends `/implement` quand je veux conduire chaque ticket et regarder le code au fur et à mesure. Je prends `/implement-spec` quand le découpage est solide et que je préfère orchestrer : je relis à la fin, sur une seule branche.

## `/tdd` : rouge, puis vert

`/tdd` est un skill automatique. `/implement` l'appelle, les sous-agents de `/implement-spec` aussi, et vous pouvez le lancer seul quand vous voulez construire un comportement test d'abord sans spécification.

### Un bon test

Un bon test vérifie un comportement à travers une interface publique, pas les détails d'implémentation. Il se lit comme une spécification : « un client peut payer un panier valide » dit exactement quelle capacité existe, et ce test survit aux refactorings parce qu'il ignore la structure interne.

### Tester aux coutures convenues

Avant d'écrire un test, l'agent liste les coutures qu'il compte tester et vous les fait confirmer, avec une ligne sur ce que chacune attrape et ce qu'elle rate. Aucun test n'est écrit sur une couture non confirmée. On ne peut pas tout tester ; s'accorder d'abord sur les coutures concentre l'effort sur les chemins critiques.

### Les règles de la boucle

- **Rouge avant vert.** Le test qui échoue d'abord, puis juste assez de code pour le faire passer. Pas de fonctionnalité anticipée.
- **Une tranche à la fois.** Une couture, un test, une implémentation minimale par cycle.
- **Le refactoring ne fait pas partie de la boucle.** Il appartient à l'étape de relecture.

### Les anti-modèles

Le skill nomme trois erreurs à éviter :

- **le test couplé à l'implémentation**, qui simule des collaborateurs internes, teste des méthodes privées ou vérifie en interrogeant la base au lieu de passer par l'interface. Il casse au refactoring alors que le comportement n'a pas changé ;
- **le test tautologique**, qui recalcule la valeur attendue comme le fait le code, par exemple `expect(add(a, b)).toBe(a + b)`. Il passe par construction. La valeur attendue doit venir d'une source indépendante : une valeur littérale connue, un exemple résolu, la spécification ;
- **le découpage horizontal**, qui écrit tous les tests puis tout le code. Ces tests vérifient un comportement imaginé. On avance plutôt par tranches verticales : un test, une implémentation, et on recommence en tenant compte de ce que le cycle précédent a appris.

## `/diagnosing-bugs` : une boucle de retour serrée d'abord

`/diagnosing-bugs` sert aux bugs difficiles : celui qui résiste au premier regard, le test instable, la régression apparue entre deux versions qui marchaient. Il interdit de théoriser tant qu'il n'existe pas une **boucle de retour serrée** (*tight feedback loop*).

### Phase 1 : construire la boucle

C'est le cœur du skill. L'objectif est une seule commande, déjà exécutée au moins une fois, qui :

- passe au rouge sur *ce* bug, avec le symptôme exact décrit par l'utilisateur ;
- donne le même verdict à chaque exécution ;
- tourne en quelques secondes ;
- s'exécute sans humain.

Le skill liste des façons de la construire, dans un ordre de préférence : un test qui échoue, un script `curl` contre le serveur de développement, une commande CLI comparée à une sortie de référence, un navigateur sans interface, le rejeu d'une trace capturée, un harnais jetable, une boucle de fuzz, un harnais de bissection pour `git bisect run`, une comparaison entre deux versions. En dernier recours, un script Bash fourni (`scripts/hitl-loop.template.sh`) guide un humain pas à pas.

Pour un bug intermittent, le but n'est pas une reproduction parfaite mais un taux de reproduction assez haut pour travailler. Si aucune boucle n'est possible, l'agent s'arrête, dit ce qu'il a essayé et demande un accès, un artefact capturé ou une instrumentation temporaire.

### Les phases suivantes

1. **Reproduire et minimiser** : réduire le scénario jusqu'à ce que chaque élément restant soit nécessaire.
2. **Formuler des hypothèses** : trois à cinq, classées, chacune réfutable, montrées à l'utilisateur avant de les tester.
3. **Instrumenter** : une variable à la fois, avec des logs marqués d'un préfixe unique comme `[DEBUG-a4f2]` pour les retirer d'un seul `grep`.
4. **Corriger** : un test de régression qui échoue avant le correctif, s'il existe une couture correcte pour lui. S'il n'y en a pas, c'est un constat en soi, à transmettre à `/architect-codebase`.
5. **Nettoyer** : boucle repassée, instrumentation retirée, hypothèse gagnante écrite dans le commit ou la pull request.

Le skill demande aussi de masquer tout secret dans les sorties montrées, en écrivant `<REDACTED>` à la place. Une fois le correctif en place, je lance `/retro` dans la même session pour chercher ce qui aurait évité le bug.

## Les skills de la pile

Avant d'écrire du code, `/implement` et chaque sous-agent de `/implement-spec` chargent les skills de ma pile qui correspondent à la partie du code touchée. La liste vient de la section *Stack* de `/workflow`.

| Partie du code | Skill | Ce qu'il couvre |
| --- | --- | --- |
| NestJS, toujours | `nestjs` | création du projet, organisation, modules |
| Points d'accès HTTP | `nestjs-feature` | contrôleurs, validation, codes et corps d'erreur |
| Persistance | `nestjs-data` | Drizzle ou TypeORM, migrations, transactions |
| Authentification | `nestjs-auth` | connexion, sessions, jetons, clés d'API, permissions |
| Production | `nestjs-production` | configuration, logs, santé, limites de débit, OpenAPI, arrêt propre |
| Tests NestJS | `nestjs-testing` | `@nestjs/testing`, tests unitaires, de service et de bout en bout |
| Angular | `angular-developer` | composants, signaux, formulaires, routage, rendu serveur, tests |
| Interface | `impeccable` | mise en page, typographie, interactions, finitions |

Côté serveur, je charge toujours `nestjs`, puis celui qui correspond à la tâche. `/tdd` s'appuie sur `nestjs-testing` pour le harnais de test. Côté client, `angular-developer`, et `impeccable` dès qu'il s'agit de l'apparence ou de l'ergonomie d'un écran.

Ces skills sont automatiques. Claude les charge aussi de lui-même quand la tâche correspond à leur description, même hors du flux.

## À retenir

- `/implement` construit un ticket test d'abord, vérifie les types et les tests, appelle `/spec-review` puis commite.
- `/implement-spec` parcourt le graphe de tâches avec un sous-agent par ticket, chacun dans son *worktree*, et fusionne tout sur une branche d'intégration.
- `/tdd` avance une couture et un test à la fois, rouge avant vert, et laisse le refactoring à la relecture.
- `/diagnosing-bugs` refuse toute hypothèse tant qu'une commande rapide et déterministe ne passe pas au rouge sur le bug.
- Chargez les skills de la pile avant de coder : `nestjs` et son spécialiste côté serveur, `angular-developer` et `impeccable` côté client.
