---
title: "Spécifier : de la conversation aux tickets"
description: "Transformer un interrogatoire en spécification avec to-spec, la découper en tranches verticales avec to-tickets, et trier les tickets entrants avec triage."
course: workflow-claude-code
order: 5
---

À la fin de `/grill-with-docs`, tout le raisonnement est dans la fenêtre de contexte. Si je ferme la session, il disparaît. La spécification et les tickets le sortent de la session et le posent sur le gestionnaire de tickets, sous une forme qu'un agent pourra reprendre sans moi.

| Skill | Quand l'utiliser | Manuel / auto |
| --- | --- | --- |
| `to-spec` | après l'interrogatoire, pour un chantier sur plusieurs sessions | manuel |
| `to-tickets` | juste après `/to-spec`, dans la même session | manuel |
| `triage` | pour les tickets que vous n'avez pas écrits | manuel |

## `/to-spec` : synthétiser, pas interroger

`/to-spec` ne pose pas de questions. Il synthétise ce qui a déjà été dit, plus ce que l'agent a compris du code, et publie le résultat sur le gestionnaire de tickets configuré par `/setup-skills`.

### Les coutures de test

Avant d'écrire, l'agent esquisse les **coutures** (*seams*) où la fonctionnalité sera testée. Une couture est l'interface publique par laquelle on observe un comportement sans aller voir à l'intérieur. Il préfère les coutures existantes, choisit la plus haute possible, et vise le moins de coutures possible, idéalement une seule. Il vous demande de confirmer qu'elles correspondent à ce que vous attendez. C'est la seule question qu'il pose.

### Le contenu de la spécification

La spécification suit un modèle fixe :

- **Problem Statement** et **Solution**, du point de vue de l'utilisateur ;
- **User Stories** : une longue liste numérotée de récits du type « En tant que…, je veux…, afin de… », qui doit couvrir tous les aspects de la fonctionnalité ;
- **Implementation Decisions** : modules touchés, interfaces, schéma, contrats d'API, décisions d'architecture ;
- **Testing Decisions** : ce qui fait un bon test, les modules testés, les tests existants dont s'inspirer ;
- **Out of Scope** et **Further Notes**.

Pas de chemins de fichiers ni d'extraits de code : ils vieillissent trop vite. Une exception : si un prototype a produit un extrait qui exprime une décision mieux que la prose (une machine à états, un schéma, la forme d'un type), l'agent l'inclut en le signalant.

La spécification reçoit directement le libellé `ready-for-agent`. Elle n'a pas besoin de passer par le tri.

## `/to-tickets` : découper en tranches verticales

`/to-tickets` découpe une spécification, un plan ou la conversation en cours en **tickets**. Si vous lui passez une référence (un numéro de ticket, une URL, un chemin), il la lit en entier, commentaires compris.

### La tranche verticale (*tracer bullet*)

Chaque ticket est une tranche verticale : un chemin étroit mais complet à travers toutes les couches, du schéma à l'interface en passant par l'API et les tests. Pas une tranche horizontale, du genre « toutes les migrations » puis « tous les contrôleurs ».

Les règles sont courtes :

- une tranche terminée se démontre ou se vérifie seule ;
- une tranche tient dans une seule fenêtre de contexte vierge ;
- le pré-refactoring, s'il y en a, passe en premier. « Rendre le changement facile, puis faire le changement facile. »

Pour le salon de l'exemple précédent, un premier ticket pourrait être « un exposant validé réserve un stand libre et le voit dans sa liste », de la table jusqu'à l'écran, avec son test. Le ticket suivant ajoute le conflit entre deux réservations.

### Les bords bloquants (*blocking edges*)

Chaque ticket déclare les tickets qui doivent être terminés avant qu'il puisse commencer. Un ticket sans bloqueur peut démarrer tout de suite. L'ensemble forme un graphe, pas une liste.

La **frontière** est l'ensemble des tickets dont tous les bloqueurs sont terminés : ceux qu'on peut prendre maintenant. Pour une chaîne linéaire, c'est simplement de haut en bas. Pour un graphe plus large, plusieurs tickets peuvent être sur la frontière en même temps, et c'est ce que `/implement-spec` exploite pour travailler en parallèle.

### Le refactoring large : *expand–contract*

Le découpage vertical a une exception. Un refactoring large est un changement mécanique (renommer une colonne, changer le type d'un symbole partagé) dont le rayon d'impact (*blast radius*) touche toute la base de code. Une seule modification casse des milliers d'appels d'un coup, et aucune tranche verticale ne peut rester au vert.

Dans ce cas, `/to-tickets` suit le schéma *expand–contract* :

1. **Expand** : ajouter la nouvelle forme à côté de l'ancienne, sans rien casser.
2. **Migrate** : déplacer les appels vers la nouvelle forme par lots (par paquet, par répertoire), un ticket par lot, chacun bloqué par l'étape *expand*. L'ancienne forme existe toujours, donc l'intégration continue reste au vert d'un lot à l'autre.
3. **Contract** : supprimer l'ancienne forme quand plus personne ne l'appelle, dans un ticket bloqué par tous les lots.

Si même les lots ne peuvent pas rester au vert seuls, ils partagent une branche d'intégration et bloquent tous un dernier ticket d'intégration et de vérification. Le vert n'est promis qu'à ce moment-là.

### La validation avec vous

Avant de publier, l'agent présente le découpage sous forme de liste numérotée : titre, bloqueurs, et ce que chaque ticket livre de bout en bout. Il vous demande si la granularité convient, si les bords bloquants sont justes, et s'il faut fusionner ou découper certains tickets. Il itère jusqu'à votre accord.

### La publication

La forme dépend du gestionnaire configuré :

- **Markdown local** : un fichier par ticket sous `.scratch/<fonctionnalité>/issues/<NN>-<slug>.md`, numéroté à partir de `01` dans l'ordre des dépendances, avec une ligne « Blocked by ».
- **GitHub, GitLab ou autre** : un ticket par tranche, publié bloqueurs d'abord pour que les liens de blocage natifs pointent vers de vrais numéros. Si la source était un ticket existant, chaque ticket en devient un sous-ticket.

Dans les deux cas, chaque ticket décrit le comportement attendu du point de vue de l'utilisateur et liste des critères d'acceptation à cocher. Il reçoit le libellé `ready-for-agent`, parce qu'il est prêt pour un agent par construction. L'agent ne ferme ni ne modifie le ticket parent.

## `/triage` : les tickets que vous n'avez pas écrits

`/triage` fait passer les tickets entrants par une petite machine à états. Chaque ticket trié porte exactement une catégorie (`bug` ou `enhancement`) et un état parmi les cinq configurés par `/setup-skills` : `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.

On l'utilise en langage naturel : « montre-moi ce qui demande mon attention », « regardons le #42 », « passe le #42 en ready-for-agent ».

### Trier un ticket

Pour un ticket donné, l'agent :

1. lit tout le ticket et explore le code, en cherchant si le comportement demandé existe déjà et si une demande semblable a déjà été refusée dans `.out-of-scope/` ;
2. recommande une catégorie et un état, puis attend votre décision ;
3. vérifie l'affirmation : il reproduit le bug à partir des étapes décrites, ou vérifie qu'une pull request fait ce qu'elle annonce ;
4. si la demande est floue, lance `grilling` et `domain-modeling` pour la mettre en forme ;
5. applique le résultat.

Pour `ready-for-agent`, le résultat est un **brief d'agent** posté en commentaire : ce que le système doit faire (pas comment), des critères d'acceptation vérifiables, ce qui est hors périmètre, sans chemins de fichiers qui vieilliraient. Pour `needs-info`, ce sont des notes de tri : ce qui est établi, et des questions précises pour la personne qui a ouvert le ticket. Un refus d'amélioration est consigné dans `.out-of-scope/`, un fichier par concept, pour ne pas rouvrir le débat la prochaine fois.

Tout ce que l'agent poste pendant le tri commence par une mention indiquant qu'il a été généré par une IA.

### Quand ne pas trier

`/triage` ne sert qu'aux tickets que vous n'avez pas créés : rapports de bug, demandes de fonctionnalité qui arrivent brutes. Les tickets produits par `/to-tickets` sont déjà prêts pour un agent. Ils ont déjà leur libellé `ready-for-agent`, leurs critères d'acceptation et leurs bloqueurs : les trier referait un travail déjà fait.

De même, les tickets d'une carte `/wayfinder` ne portent jamais de libellé de tri : ce sont des décisions, pas du travail d'implémentation.

## À retenir

- `/to-spec` synthétise la conversation sans interroger, confirme les coutures de test avec vous, et publie une spécification `ready-for-agent`.
- `/to-tickets` découpe en tranches verticales qui traversent toutes les couches, chacune avec ses bords bloquants.
- La frontière est l'ensemble des tickets dont tous les bloqueurs sont terminés.
- Un refactoring large suit *expand–contract* au lieu du découpage vertical.
- `/triage` est réservé aux tickets entrants ; ne triez jamais ceux de `/to-tickets`.
