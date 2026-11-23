---
title: "Planifier : interroger, prototyper, chercher"
description: "Les skills qui aiguisent une idée avant la première ligne de code : grilling, grill-with-docs, prototype, research, wayfinder et to-questionnaire."
course: workflow-claude-code
order: 4
---

La planification est l'étape que je sautais le plus quand je débutais avec les agents. C'est aussi celle qui m'a fait gagner le plus de temps une fois que je m'y suis tenu. Six skills s'en occupent, et chacun répond à une situation précise.

| Skill | Quand l'utiliser | Manuel / auto |
| --- | --- | --- |
| `grilling` | aiguiser un plan sans dépôt sous la main | auto |
| `grill-with-docs` | aiguiser une idée dans un dépôt, en gardant une trace | manuel |
| `prototype` | une question qui demande une réponse exécutable | auto |
| `research` | des faits à chercher dans la documentation ou le code source | auto |
| `wayfinder` | un chantier trop gros et trop flou pour une session | manuel |
| `to-questionnaire` | la réponse est dans la tête de quelqu'un d'autre | manuel |

## `/grilling` : l'interrogatoire

`/grilling` m'interroge sans relâche sur un plan, une décision ou une idée, jusqu'à ce qu'on arrive à une compréhension partagée.

### L'arbre de décision et la frontière

L'agent se représente le sujet comme un arbre de décisions : chaque décision ouvre les décisions qui en dépendent. Il travaille par séries (*rounds*). La **frontière** (*frontier*) est l'ensemble des décisions dont les prérequis sont déjà tranchés, c'est-à-dire les questions qu'on peut poser maintenant sans deviner une réponse qu'on n'a pas encore entendue.

À chaque série, l'agent pose toute la frontière d'un coup. Chaque question est numérotée et accompagnée de sa réponse recommandée, formulée pour qu'un simple « oui » l'accepte. Puis il attend mes réponses. Une question qui dépend d'une autre question encore ouverte attend la série suivante.

### Les faits à l'agent, les décisions à moi

C'est la règle qui rend le skill agréable. Chercher les faits est le travail de l'agent : s'il a besoin de savoir comment le code gère déjà les utilisateurs, il envoie un sous-agent lire le dépôt au lieu de me demander. Les décisions, elles, me reviennent : il me les soumet et attend.

L'interrogatoire est terminé quand la frontière est vide : toutes les branches visitées, rien de supposé en silence. L'agent n'agit pas tant que je n'ai pas confirmé qu'on se comprend.

### Exemple de série

Imaginons une fonctionnalité : les exposants d'un salon réservent un stand en ligne. Voici à quoi ressemble une première série, en abrégé :

```text
Q1 - Qui peut réserver : un exposant ne peut-il réserver qu'après
validation de son inscription par l'organisateur ?
→ Oui. La réservation exige une inscription validée.

Q2 - Plusieurs stands : un exposant peut-il réserver plusieurs
stands pour le même salon ?
→ Oui, sans limite pour la première version.

Q3 - Conflit : si deux exposants demandent le même stand en même
temps, le premier qui confirme l'emporte-t-il ?
→ Oui. Le second reçoit une erreur et la liste des stands libres.
```

Dans la sortie réelle, chaque question porte un titre en gras et un petit marqueur visuel. Remarquez ce qui manque : rien sur l'annulation ou le paiement. Ces questions dépendent de Q1 et Q2. Elles arriveront dans la série suivante, une fois que j'aurai répondu « oui », « oui », puis « non, on garde le stand bloqué cinq minutes » à Q3.

## `/grill-with-docs` : l'interrogatoire qui laisse une trace

`/grill-with-docs` lance deux skills : `grilling` pour l'interrogatoire et `domain-modeling` pour le modèle du domaine. C'est mon point de départ dès que je travaille dans un dépôt.

Pendant l'interrogatoire, `domain-modeling` ajoute une discipline sur les mots :

- Si j'utilise un terme qui contredit `GLOSSARY.md`, l'agent le relève aussitôt.
- Si un mot est flou ou surchargé, il propose un terme précis. « Compte » désigne-t-il le client ou l'utilisateur ?
- Il invente des scénarios concrets pour éprouver les frontières entre les concepts.
- Quand j'affirme comment quelque chose fonctionne, il vérifie que le code est d'accord, et signale la contradiction sinon.

### `GLOSSARY.md`

Dès qu'un terme est tranché, l'agent met `GLOSSARY.md` à jour, sans attendre la fin. Le fichier est créé au premier terme résolu s'il n'existe pas. C'est un glossaire et rien d'autre : pas de détails d'implémentation, pas de notes de travail, pas de spécification.

### Les ADR

Un ADR enregistre une décision dans `docs/adr/`. L'agent n'en propose un que si trois conditions sont réunies :

1. la décision est difficile à défaire ;
2. elle surprendrait un lecteur futur sans contexte ;
3. elle résulte d'un vrai compromis entre plusieurs options.

S'il manque une condition, pas d'ADR. Dans l'exemple du salon, « le premier qui confirme l'emporte, avec un blocage de cinq minutes » pourrait en mériter un si on a écarté une file d'attente pour de bonnes raisons.

## `/prototype` : répondre avec du code jetable

Un prototype est du code jetable qui répond à une question. La question décide de la forme, et il y en a deux :

- **« Cette logique, ce modèle d'états, tient-il la route ? »** L'agent produit un seul fichier HTML, à ouvrir d'un double-clic. Il contient des boutons pour jouer librement avec la machine à états et des parcours guidés par onglets qui la poussent dans les cas difficiles à raisonner sur le papier. Quelqu'un qui ne code pas peut s'en servir.
- **« À quoi ça doit ressembler ? »** L'agent génère plusieurs variantes d'interface très différentes sur une même route, qu'on bascule avec un paramètre d'URL `?variant=` et une barre flottante en bas de l'écran. Il préfère greffer les variantes sur une page existante, avec ses vraies données, plutôt que sur une page vide où tout a l'air correct.

Quelques règles valent pour les deux. Le prototype est rangé près de l'endroit où il servira mais nommé pour qu'on voie que c'est un prototype. Il se lance avec une seule commande. Il ne persiste rien par défaut, il n'a ni tests ni finitions, et il affiche l'état complet après chaque action.

Quand c'est fini, la décision validée entre dans le vrai code. Le prototype, lui, est conservé comme source primaire sur une branche jetable (`prototype/<nom>`) en dehors de `main`, avec un pointeur depuis le ticket d'implémentation.

## `/research` : déléguer la lecture

`/research` lance un agent en arrière-plan, avec un contexte vierge, pendant que je continue à travailler. Cet agent enquête sur la question à partir de sources primaires : documentation officielle, code source, spécifications, API de première main. Il remonte chaque affirmation jusqu'à la source qui la porte.

Il écrit ses conclusions dans un seul fichier Markdown, avec une citation pour chaque affirmation, rangé là où le dépôt garde déjà ce genre de notes. Je reprends ensuite ce fichier dans `/grill-with-docs`. La recherche alimente la réflexion ; elle ne la remplace pas.

## `/wayfinder` : cartographier un chantier flou

Certains chantiers sont trop gros pour une session et trop flous pour savoir par où commencer : un nouveau projet, une très grosse fonctionnalité. `/wayfinder` dessine une **carte** partagée sur le gestionnaire de tickets, puis résout ses **tickets de décision** un par un jusqu'à ce que le chemin soit clair. C'est le flux le plus exigeant de mon workflow, je le réserve à ces cas-là.

### La carte

La carte est un ticket avec le libellé `wayfinder:map`. Elle sert d'index : elle résume les décisions et pointe vers les tickets qui en contiennent le détail. Son corps a cinq sections :

- **Destination** : à quoi ressemble la fin, en une ou deux lignes ;
- **Notes** : le domaine, les skills à consulter, les préférences ;
- **Decisions so far** : une ligne par ticket fermé, avec un lien ;
- **Not yet specified** : le brouillard (*fog of war*), ce qu'on devine sans pouvoir encore le formuler précisément ;
- **Out of scope** : ce qu'on a écarté de ce chantier.

### Les tickets

Chaque ticket est un ticket enfant de la carte, avec un libellé `wayfinder:<type>` :

| Type | Mode | Ce qu'il fait |
| --- | --- | --- |
| `research` | autonome | cherche un fait avec `/research` |
| `prototype` | avec moi | produit un artefact concret pour réagir |
| `grilling` | avec moi | une conversation, le cas par défaut |
| `task` | les deux | un travail manuel qui débloque une décision |

On passe un sujet du brouillard à un ticket quand on peut formuler la question précisément, même si on ne peut pas encore y répondre.

### Deux modes

Avec une idée vague, `/wayfinder` **trace la carte** : il fixe la destination par un interrogatoire, explore l'espace en largeur, crée la carte et les premiers tickets, relie les blocages, lance les tickets de recherche en parallèle, puis s'arrête. Avec une carte existante, il **avance sur la carte** : il prend le premier ticket de la frontière, se l'assigne avant tout travail, le résout, ferme le ticket et ajoute une ligne aux décisions.

Une règle : un seul ticket résolu par session, sauf pour les tickets de recherche. Quand la carte est dégagée, on passe à `/to-spec`.

## `/to-questionnaire` : quand la réponse est ailleurs

Parfois ce qui me bloque n'est ni dans ma tête ni dans le code, mais chez quelqu'un d'autre : un client, un expert métier, un collègue d'une autre équipe. `/to-questionnaire` écrit pour cette personne un questionnaire à remplir de façon asynchrone, ou ensemble pendant une réunion.

C'est l'inverse de `/grilling`. L'agent ne m'interroge pas sur le sujet, mais sur l'envoi, en deux échanges : à qui il va (rôle, expertise, relation avec moi) et ce dont j'ai besoin en retour. Il écrit ensuite `to-questionnaire-<slug>.md` dans le répertoire courant : un contexte d'un paragraphe, des consignes de réponse, puis des questions classées par thème, les plus importantes d'abord, une idée par question. Les réponses reviennent nourrir `/grill-with-docs` ou `/to-spec`.

## À retenir

- `/grilling` pose toute la frontière à chaque série, avec une réponse recommandée par question ; les faits sont pour l'agent, les décisions pour vous.
- Dans un dépôt, préférez `/grill-with-docs` : même interrogatoire, plus `GLOSSARY.md` et des ADR réservés aux décisions difficiles à défaire.
- `/prototype` répond à une question de logique (un fichier HTML) ou d'interface (des variantes sur une route), puis il est rangé sur une branche jetable.
- `/research` lit les sources primaires en arrière-plan et rend un fichier Markdown cité.
- `/wayfinder` produit des décisions, pas du code ; `/to-questionnaire` va chercher la réponse chez quelqu'un d'autre.
