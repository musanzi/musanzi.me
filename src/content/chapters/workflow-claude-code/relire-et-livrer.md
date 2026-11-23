---
title: "Relire et livrer"
description: "Relire un diff selon deux axes avec spec-review, appliquer mes deux règles de code, rédiger la pull request avec pr et améliorer l'environnement avec retro."
course: workflow-claude-code
order: 7
---

Le code est écrit et les tests passent. Il reste à vérifier qu'il fait ce qu'on a demandé, qu'il respecte les règles du projet, à le présenter à la personne qui va le fusionner, et à tirer les leçons de la session.

| Skill | Quand l'utiliser | Manuel / auto |
| --- | --- | --- |
| `spec-review` | relire une branche ou une pull request depuis un point fixe | auto |
| `pr` | rédiger la description d'une pull request | auto |
| `retro` | après une construction, surtout si elle s'est mal passée | manuel |

## `/spec-review` : deux axes, deux sous-agents

`/implement` et `/implement-spec` appellent `/spec-review` à la fin. Je le lance aussi seul, dès que je veux relire une branche ou une pull request.

### Le point fixe

La relecture porte sur le diff entre `HEAD` et un point fixe que vous donnez : un commit, une branche, une étiquette, `main`, `HEAD~5`. Si vous n'en donnez pas, l'agent le demande. Il utilise `git diff <point-fixe>...HEAD` (avec trois points, pour comparer à la base commune) et la liste des commits. Avant d'aller plus loin, il vérifie que la référence existe et que le diff n'est pas vide.

```text
/spec-review main
```

### Les deux axes

- **Standards** : le code respecte-t-il les règles de code documentées du dépôt ?
- **Spec** : le code fait-il ce que le ticket ou la spécification demandait ?

Chaque axe tourne dans son propre sous-agent, avec un contexte vierge, en parallèle. L'agent principal rassemble ensuite les deux rapports sous deux titres séparés, sans les fusionner ni les reclasser.

Cette séparation a une raison. Un code peut suivre toutes les règles et implémenter la mauvaise chose. Il peut aussi faire exactement ce que le ticket demandait en cassant les conventions du projet. Les rapporter séparément empêche un axe de masquer l'autre.

### L'axe Spec

L'agent cherche la spécification dans cet ordre : les références de tickets dans les messages de commit (`#123`, `Closes #45`), un chemin passé en argument, un fichier dans `docs/`, `specs/` ou `.scratch/` qui correspond à la branche. Sinon, il vous demande. S'il n'y a pas de spécification, l'axe Spec est sauté et le rapport le dit.

Le sous-agent rapporte trois choses, en citant la ligne de la spécification à chaque fois :

- ce qui était demandé et manque ou est incomplet ;
- ce qui est dans le diff sans avoir été demandé ;
- ce qui semble implémenté, mais de travers.

### L'axe Standards

L'agent rassemble tous les fichiers qui décrivent comment écrire le code dans ce dépôt, `CODING_STANDARDS.md` ou `CONTRIBUTING.md` en tête s'ils existent. Il lit aussi `~/.claude/CLAUDE.md`, au cas où mes règles globales auraient changé.

À cela s'ajoute une **base de code smells** tirée du chapitre 3 de *Refactoring* de Martin Fowler : nom mystérieux, code dupliqué, envie de fonctionnalité (*Feature Envy*), généralité spéculative, chaînes de messages, et quelques autres. Deux règles l'encadrent. Une règle documentée du dépôt l'emporte toujours sur cette base. Et un smell est toujours signalé comme une question de jugement (« possible Feature Envy »), jamais comme une violation ferme.

## Mes deux règles de code

Mes règles globales passent avant toutes les autres sur l'axe Standards, et leur non-respect est une violation ferme, pas une question de jugement.

### Pas de commentaires dans le code

Aucun commentaire : ni de ligne, ni de bloc, ni JSDoc, ni HTML, ni dans les styles. Le code doit s'expliquer par ses noms. Seules les directives d'outils sont permises :

```ts
// eslint-disable-next-line
// @ts-expect-error
```

et `<!-- prettier-ignore -->` dans les gabarits. Le code généré est exempté.

### Une classe CQRS par fichier

Chaque commande, requête, événement et gestionnaire a son propre fichier, nommé d'après la classe. Pour la réservation d'un stand, cela donne :

```text
src/stands/
├── create-stand.command.ts
├── create-stand.handler.ts
├── stand-created.event.ts
├── stand-created.handler.ts
├── get-stand.query.ts
└── get-stand.handler.ts
```

Jamais plusieurs gestionnaires dans un même fichier, jamais plusieurs commandes ensemble. Un fichier, une classe, un nom qui la désigne.

Ces deux règles sont écrites dans le `README.md` du dépôt, dans `/workflow` et dans `/spec-review`. Si vous adoptez le workflow avec d'autres règles, c'est là qu'il faut les changer (le dernier chapitre y revient).

## `/pr` : la description de la pull request

`/pr` est automatique : l'agent l'utilise dès qu'il écrit une pull request. Il suit un modèle en trois sections, sans préambule, avec le vocabulaire de `GLOSSARY.md`.

### Summary

La plus petite vue qui rend le point clair. Le skill propose un menu : du pseudo-code pour une logique, un arbre d'appels pour un flux d'exécution, un arbre de composants pour une interface, une arborescence de fichiers pour un refactoring, un diagramme Mermaid pour des échanges entre composants, ou un `diff` quand la structure existe déjà et que seul le changement compte. On en choisit un, parfois plusieurs, rarement tous.

```diff
 src/stands/
+├── reserve-stand.command.ts
+├── reserve-stand.handler.ts
 ├── create-stand.command.ts
 └── create-stand.handler.ts
```

### Evidence

Une preuve concrète que le changement marche, avant et après. Une capture d'écran est la meilleure preuve quand le changement est visuel et que l'environnement le permet. Ensuite viennent les preuves par exécution : sortie de console, test qui échouait et qui passe maintenant.

### Merge Danger

Deux questions. La **porte** : est-ce une porte à double sens, qu'on peut retraverser en annulant la fusion, ou à sens unique, comme une action destructive ou une décision difficile à défaire ? Et le **rayon d'impact** (*blast radius*), en un mot : décalage de mise en page, rupture pour les consommateurs d'une API, affichage mobile, etc.

Cette section est celle que je lis en premier quand je relis la pull request de quelqu'un d'autre.

## `/retro` : améliorer l'environnement, pas le code

`/retro` est le dernier pas du flux. Il ne corrige pas le code de la session : il propose des changements à l'environnement de l'agent pour que la prochaine session se passe mieux.

### Quand le lancer

Dans la session qu'il analyse, avant de vider le contexte. Si c'est trop tard, indiquez-lui le journal de la session concernée. Je le lance systématiquement après une construction qui a dérapé, et après un correctif de `/diagnosing-bugs` pour me demander ce qui aurait évité le bug.

### Ce qu'il cherche

| Catégorie | La question |
| --- | --- |
| Navigation | l'agent a-t-il mis longtemps à trouver un fichier ? Un pointeur de navigation aiderait-il ? |
| Vérifications automatiques | un linter, un typage, un test aurait-il attrapé l'erreur ? Le dépôt a-t-il un hook de pre-commit ou une CI ? |
| Règles de code | le relecteur aurait-il dû attraper quelque chose ? Faut-il ajouter, retirer ou clarifier une règle ? |
| `AGENTS.md` global | des consignes devraient-elles devenir des règles ou des vérifications ? |
| Économie d'outils | un appel d'outil a-t-il coûté trop cher ? |
| Consignes sans effet | des instructions ne changent-elles rien au comportement ? |
| Accès à l'information | une information cruciale manquait-elle à l'agent ? |

Il présente ensuite ses propositions par ordre de gravité.

### Mécanique ou jugement

C'est la distinction qui rend `/retro` utile. Une erreur **mécanique** (un motif syntaxique fixe, une API interdite, une forme d'import, l'emplacement d'un fichier) devient une vérification déterministe : une règle de linter, un hook de pre-commit, un job de CI. Une question de **jugement** (la cohérence entre fichiers, le respect du style environnant) devient une règle dans `CODING_STANDARDS.md`.

Le skill rappelle aussi pourquoi les règles vont chez le relecteur. L'agent qui implémente subit la plus forte pression de contexte : il explore, écrit et débogue. Le relecteur reçoit un diff et n'a rien d'autre à faire. C'est donc à lui d'imposer les règles de code. Et `CLAUDE.md` ou `AGENTS.md`, chargés dans chaque session, doivent rester très courts, surtout des pointeurs vers d'autres fichiers.

## À retenir

- `/spec-review` relit le diff depuis un point fixe selon deux axes, Standards et Spec, dans deux sous-agents parallèles dont les rapports restent séparés.
- Mes deux règles sont des violations fermes : pas de commentaires sauf directives d'outils, et une classe CQRS par fichier nommé d'après elle (`create-stand.command.ts`, `create-stand.handler.ts`).
- `/pr` produit trois sections : un résumé visuel minimal, une preuve avant/après et le danger de fusion.
- `/retro` améliore l'environnement : les erreurs mécaniques deviennent des vérifications, les questions de jugement des règles de code.
