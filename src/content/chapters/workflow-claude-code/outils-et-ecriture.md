---
title: "Santé du code, écriture et outils"
description: "Les skills hors du flux principal pour entretenir la base de code, écrire pour les agents et les humains, protéger git, et adapter le workflow à votre pile."
course: workflow-claude-code
order: 8
---

Les chapitres précédents suivaient une fonctionnalité de bout en bout. Les skills de ce chapitre servent entre deux fonctionnalités, ou en dessous d'elles : entretenir le code, écrire, et outiller Claude Code.

| Skill | Quand l'utiliser | Manuel / auto |
| --- | --- | --- |
| `architect-codebase` | un moment libre pour améliorer la base de code | manuel |
| `codebase-design` | concevoir l'interface d'un module | auto |
| `domain-modeling` | un terme flou, un glossaire, un ADR | auto |
| `writing-for-agents` | écrire un skill, `CLAUDE.md` ou `AGENTS.md` | auto |
| `interview` | transformer votre expérience en article | manuel |
| `technical-writing` | relire une documentation, une pull request, un commit | manuel |
| `unslop` | retirer les tics d'écriture d'IA d'un texte | manuel |
| `git-guardrails` | bloquer les commandes git destructrices | auto |
| `find-skills` | chercher un skill qui existe déjà | auto |

## La santé de la base de code

### `/architect-codebase` : trouver où approfondir

Je le lance quand j'ai un moment, pour garder la base de code agréable à faire évoluer par un agent. Il cherche des **occasions d'approfondissement** (*deepening opportunities*) : des refactorings qui transforment des modules superficiels en modules profonds, pour les rendre plus faciles à tester et à parcourir.

Il commence par choisir où regarder. Si vous indiquez une direction, il la prend. Sinon, il parcourt l'historique des commits pour repérer les zones qui changent souvent, parce qu'approfondir un module ne paie que s'il va encore changer. Puis un sous-agent parcourt le code et note les frictions : un concept qui oblige à sauter entre beaucoup de petits modules, une interface presque aussi complexe que son implémentation, du code difficile à tester par son interface actuelle.

Le résultat est une page HTML autonome, écrite dans le répertoire temporaire du système pour que rien n'atterrisse dans le dépôt. Chaque candidat y a sa carte : les fichiers concernés, le problème, la solution, les bénéfices, un schéma avant/après et un niveau de recommandation (`Strong`, `Worth exploring`, `Speculative`). L'agent vous demande ensuite lequel explorer, puis lance `grilling` sur celui que vous choisissez. Le candidat retenu devient une idée qui entre dans le flux principal par `/grill-with-docs`.

### `codebase-design` : le vocabulaire des modules profonds

`codebase-design` est une référence, pas une session. `/tdd` et `/architect-codebase` s'en servent pour parler de conception avec des mots précis :

- **module** : tout ce qui a une interface et une implémentation, d'une fonction à un paquet ;
- **interface** : tout ce qu'un appelant doit savoir, y compris les invariants, l'ordre des appels et les modes d'erreur ;
- **profondeur** (*depth*) : beaucoup de comportement derrière une petite interface ;
- **couture** (*seam*) : l'endroit où l'on peut changer un comportement sans modifier le code à cet endroit ;
- **adaptateur** (*adapter*) : ce qui remplit l'interface à une couture ;
- **levier** (*leverage*) et **localité** (*locality*) : ce que la profondeur apporte aux appelants et à ceux qui maintiennent le code.

Deux principes m'aident souvent. Le **test de suppression** : imaginez qu'on supprime le module. Si la complexité disparaît, c'était un simple relais ; si elle réapparaît chez chaque appelant, il méritait sa place. Et une couture avec un seul adaptateur est hypothétique ; avec deux, elle est réelle.

Pour comparer plusieurs interfaces possibles, le skill propose le schéma *Design It Twice* d'Ousterhout : plusieurs sous-agents conçoivent chacun une interface différente, en parallèle.

### `domain-modeling` : garder les mots justes

`domain-modeling` tient `GLOSSARY.md` et les ADR à jour. `/grill-with-docs`, `/triage` et `/architect-codebase` l'appellent, et vous pouvez le lancer seul quand ce sont les mots qui posent problème, pas le processus. Le chapitre sur la planification détaille son fonctionnement.

## L'écriture

### `writing-for-agents` : écrire ce que lit un agent

C'est la référence que j'utilise pour écrire un skill, un `CLAUDE.md` ou un `AGENTS.md`. `/retro` la charge avant de proposer des changements. Quelques idées que j'applique partout :

- Un **pointeur de contexte** est une référence qui nomme un contenu hors du contexte et dit quand aller le chercher. La description d'un skill en est un. C'est sa formulation qui décide si l'agent ira chercher le contenu.
- La **divulgation progressive** (*progressive disclosure*) : ce dont toutes les branches ont besoin reste dans le fichier ; ce dont seules certaines ont besoin part dans un fichier séparé, derrière un pointeur.
- Chaque étape se termine par un **critère d'achèvement** clair, pour que l'agent sache quand il a fini.
- Formuler en positif : une interdiction met le comportement interdit dans le contexte et le rend plus probable.

Le fichier `SKILL-MECHANICS.md` explique aussi le choix entre skill manuel et automatique : automatique seulement si l'agent ou un autre skill doit pouvoir l'atteindre seul ; sinon, manuel, ce qui ne coûte rien en contexte.

### `/interview` : un article à partir de vos réponses

`/interview` m'interroge, une question par message, sans réponse suggérée, puisque la matière est mon expérience. Il commence par fixer l'objectif de l'article sous la forme « Pour <lecteur>, montrer <le point> afin qu'il puisse <résultat> ». Puis il remplit une liste : le public, le point central, le contexte, les détails concrets, les objections, ce que le lecteur retient. Il fait un point à la dixième question, puis toutes les cinq questions.

Ensuite il propose un plan, rédige dans la langue de mes réponses avec uniquement les faits que j'ai donnés, applique `technical-writing` pour un tutoriel et `unslop` dans tous les cas, puis enregistre l'article en Markdown dans le répertoire courant.

### `/technical-writing` : une norme de rédaction technique

`/technical-writing` applique quatre couches à une documentation, une RFC, un README, une pull request ou un message de commit :

1. **Diátaxis** pour choisir le mode du document : tutoriel, guide pratique, référence ou explication, un seul par document ;
2. le **style Google pour développeurs** pour les phrases : vouvoiement direct, voix active, consignes à l'impératif ;
3. les règles **STE** (*Simplified Technical English*) : une consigne par phrase, des phrases courtes ;
4. le **Global English** : aucune phrase lisible de deux façons.

Au-dessus de ces couches : supprimer chaque mot inutile, préférer le mot courant, et réécrire autrement une phrase que les règles rendent pire.

### `/unslop` : retirer les tics d'IA

`/unslop` relit un texte et retire les marques d'écriture automatique : vocabulaire gonflé, regroupements forcés par trois, tirets cadratins, listes à titres en gras, conclusions creuses, phrases qui décrivent un ressenti au lieu d'un mécanisme. Ses règles sont écrites pour l'anglais. Pour un texte en français, je garde celles qui se transposent et j'ignore celles qui contredisent la typographie française, comme l'usage des guillemets droits.

## Les outils

### `git-guardrails` : bloquer les commandes destructrices

`git-guardrails` installe un hook `PreToolUse` dans Claude Code qui intercepte les commandes Bash avant leur exécution et bloque notamment :

- `git push`, toutes variantes comprises ;
- `git reset --hard` ;
- `git clean -f` et `git clean -fd` ;
- `git branch -D` ;
- `git checkout .` et `git restore .`.

L'agent vous demande d'abord la portée : ce projet seulement (`.claude/settings.json`) ou tous vos projets (`~/.claude/settings.json`). Il copie le script `block-dangerous-git.sh` dans le répertoire `hooks` correspondant, le rend exécutable, et ajoute le hook aux réglages sans écraser ceux qui existent. Il vous propose ensuite d'ajouter ou de retirer des motifs, puis vérifie le blocage :

```sh
echo '{"tool_input":{"command":"git push origin main"}}' | .claude/hooks/block-dangerous-git.sh
```

La commande doit sortir avec le code 2 et afficher un message `BLOCKED`.

### `find-skills` : chercher avant d'écrire

Avant d'écrire un nouveau skill, je vérifie qu'il n'existe pas déjà. `find-skills` s'appuie sur la CLI `npx skills` de l'écosystème ouvert de skills :

```sh
npx skills find changelog
npx skills add <paquet>
npx skills update
```

Il consulte d'abord le classement de [skills.sh](https://skills.sh/), puis vérifie la qualité avant de recommander quoi que ce soit : nombre d'installations, réputation de la source, étoiles du dépôt GitHub.

## Adapter le workflow à votre pile

Mon workflow suppose NestJS, Angular et GitHub, mais la structure ne dépend d'aucun d'eux. Voici comment je l'adapterais à une autre pile.

### Forker le dépôt

Forkez [musanzi/skills](https://github.com/musanzi/skills) sur votre compte, puis clonez votre fork à la place du mien :

```sh
git clone https://github.com/<votre-compte>/skills ~/.agents/skills
```

La boucle de liens du chapitre sur l'installation reste la même. Vos modifications vivent dans votre fork, et `git pull` les synchronise entre vos machines.

### Changer les règles de code

Mes deux règles, pas de commentaires et une classe CQRS par fichier, sont écrites à plusieurs endroits : la section *Coding rules* de `README.md`, la section *Stack* de `workflow/SKILL.md`, et l'étape 3 de `spec-review/SKILL.md`, où elles sont traitées comme des violations fermes. `/spec-review` lit aussi `~/.claude/CLAUDE.md`. Remplacez-les par les vôtres dans ces fichiers.

Pour les règles propres à un seul projet, inutile de toucher aux skills : un `CODING_STANDARDS.md` dans le dépôt est lu par l'axe Standards. Et suivez le conseil de `/retro` : si une règle est mécanique, transformez-la en vérification automatique plutôt qu'en texte.

### Remplacer les skills de la pile

Les skills `nestjs*`, `angular-developer` et `impeccable` sont chargés depuis la section *Stack* de `workflow/SKILL.md`, que `/implement` consulte. Pour une autre pile :

1. supprimez les dossiers des skills dont vous n'avez pas besoin, et leurs liens dans `~/.claude/skills` ;
2. ajoutez les skills de votre framework, en cherchant d'abord avec `find-skills` ;
3. réécrivez la section *Stack* de `workflow/SKILL.md` pour dire quel skill charger pour quelle partie du code ;
4. dans cette même section, remplacez la ligne qui associe `nestjs-testing` à `/tdd` par le skill de test de votre pile.

Le reste ne change pas : interroger avant de coder, spécifier, découper en tranches verticales, construire test d'abord, relire selon deux axes, puis améliorer l'environnement.

## À retenir

- `/architect-codebase` repère les modules à approfondir et produit un rapport HTML ; le candidat choisi entre dans le flux par `/grill-with-docs`.
- `codebase-design` et `domain-modeling` fournissent le vocabulaire commun : l'un pour la forme des modules, l'autre pour les mots du domaine.
- `writing-for-agents` guide l'écriture des skills ; `/interview`, `/technical-writing` et `/unslop` servent aux textes destinés aux humains.
- `git-guardrails` bloque les commandes git destructrices par un hook ; `find-skills` évite de réécrire un skill qui existe.
- Pour une autre pile, forkez le dépôt, changez les règles dans `README.md`, `workflow` et `spec-review`, et remplacez les skills de la section *Stack*.
