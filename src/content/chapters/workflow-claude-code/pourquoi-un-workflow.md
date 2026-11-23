---
title: "Pourquoi un workflow"
description: "Ce qui se passe quand on laisse un agent coder sans processus, la carte du flux de l'idée à la livraison et le vocabulaire du cours."
course: workflow-claude-code
order: 1
---

Un agent de code est rapide. Donnez-lui une phrase vague comme « ajoute un système de réservation » et il produira des centaines de lignes en quelques minutes. Le problème est ce qu'il a deviné pour combler les trous : qui peut annuler une réservation, ce qui se passe quand deux personnes réservent le même créneau, comment on teste tout ça. Ces décisions existent quand même, mais personne ne les a prises. L'agent les a improvisées.

J'ai construit mon workflow pour que ces décisions soient prises au bon moment, par la bonne personne, et qu'elles laissent une trace.

## Ce qu'un processus apporte à un agent

Sans processus, je retrouvais toujours les mêmes problèmes.

- L'agent commence à coder avant que l'idée soit claire. Il répond à la question qu'il croit entendre.
- Les décisions disparaissent avec la session. Le lendemain, un nouvel agent ne sait pas pourquoi on a choisi Postgres plutôt qu'un stockage d'événements.
- Les tests arrivent à la fin, s'ils arrivent, et vérifient la forme du code plutôt que son comportement.
- La relecture se fait dans la même fenêtre que l'implémentation, par un agent déjà saturé de détails.
- Les longues sessions se dégradent. Passé un certain volume de contexte, le modèle raisonne moins bien.

Chaque skill du dépôt répond à l'un de ces points. `/grill-with-docs` m'interroge avant toute ligne de code et note les termes et les décisions. `/to-spec` et `/to-tickets` transforment la conversation en spécification et en tickets qui survivent à la session. `/tdd` impose d'écrire un test qui échoue avant le code. `/spec-review` relit le diff dans des sous-agents au contexte vierge. Et `/workflow` me dit quand vider ou compacter le contexte.

## La carte, de l'idée à la livraison

Voici le flux principal pour une fonctionnalité, tel que je le suis :

1. `/grill-with-docs` m'interroge jusqu'à ce que l'idée soit nette, et enregistre les termes dans `GLOSSARY.md` et les décisions sous forme d'ADR.
2. `/prototype` répond à une question de conception avec du code jetable, si la conversation ne suffit pas à la trancher.
3. `/to-spec` transforme la conversation en spécification sur le gestionnaire de tickets.
4. `/to-tickets` découpe la spécification en tickets, chacun listant les tickets qui le bloquent.
5. `/implement` construit un ticket, ou `/implement-spec` construit tous les tickets avec des sous-agents en parallèle. Les deux passent par `/tdd`.
6. `/spec-review` vérifie le diff par rapport aux règles de code et par rapport à la spécification.
7. `/pr` rédige la description de la pull request.
8. `/retro` revient sur la session et propose des changements à l'environnement, pas au code.

Pour un petit changement, je saute les étapes 3 et 4 et je lance `/implement` dans la même session.

Les chapitres suivants reprennent chaque étape en détail. Gardez cette liste en tête : tout le reste du cours s'y raccroche.

## Le vocabulaire

### Skill

Un skill est un dossier qui contient un fichier `SKILL.md`, avec éventuellement des fichiers de référence vers lesquels il pointe. Claude Code charge `SKILL.md` quand le skill s'exécute. L'en-tête du fichier donne un nom et une description ; le corps décrit ce que l'agent doit faire.

Dans le dépôt, chaque dossier de premier niveau est un skill : `grilling/`, `to-spec/`, `tdd/`, etc. Une fois installés, ils apparaissent comme des commandes sans préfixe, comme `/grilling` ou `/workflow`.

### Manuel ou automatique

Un skill marqué **manuel** ne s'exécute que si vous tapez son nom. Techniquement, son en-tête contient `disable-model-invocation: true`, ce qui retire sa description du contexte de l'agent. Il ne coûte rien en contexte, mais c'est à vous de vous souvenir qu'il existe.

Un skill **automatique** garde sa description dans le contexte. Claude le lance de lui-même quand la tâche correspond à cette description, et d'autres skills peuvent l'appeler. Vous pouvez toujours le taper à la main.

| Type | Exemples | Qui le déclenche |
| --- | --- | --- |
| Manuel | `/workflow`, `/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement`, `/retro` | Vous seul |
| Automatique | `grilling`, `tdd`, `spec-review`, `pr`, `diagnosing-bugs`, les skills NestJS et Angular | Claude, un autre skill, ou vous |

La règle que j'applique : un skill que je décide de lancer à un moment précis du flux est manuel. Un skill dont l'agent a besoin au milieu d'une tâche, comme `tdd` pendant une implémentation ou `pr` quand il écrit une pull request, est automatique.

### Flux

Un flux (*flow*) est un chemin à travers les skills. La plupart du travail suit le **flux principal** ci-dessus. Des **bretelles d'accès** (*on-ramps*) le rejoignent à partir d'une autre situation de départ : des tickets entrants à trier, un bug à diagnostiquer, un chantier trop flou pour une session. D'autres skills restent à part : `/research`, `/to-questionnaire`, `/interview`.

### Fenêtre de contexte et « zone efficace »

La fenêtre de contexte est tout ce que le modèle voit pendant une session : vos messages, ses réponses, les fichiers lus, les sorties de commandes. Elle a une taille maximale, mais la limite qui compte arrive avant.

Mon workflow l'appelle la **zone efficace** (*smart zone*) : la partie de la fenêtre, environ 150 000 jetons sur les modèles actuels, dans laquelle le modèle raisonne encore avec précision. Au-delà, il continue de répondre, mais moins bien. Une bonne partie de `/workflow` sert à rester dans cette zone : savoir quand continuer, quand faire `/clear`, quand déléguer à un sous-agent et quand faire `/compact`. Le chapitre sur le flux principal y revient.

### Gestionnaire de tickets, glossaire et ADR

Trois autres termes reviennent souvent.

- Le **gestionnaire de tickets** (*issue tracker*) est l'endroit où vivent les spécifications et les tickets : GitHub Issues par défaut, GitLab, ou des fichiers Markdown dans `.scratch/`.
- `GLOSSARY.md` est le glossaire du domaine du projet. Il définit les termes métier et rien d'autre, sans détails d'implémentation.
- Un **ADR** (*Architecture Decision Record*) est un court document dans `docs/adr/` qui enregistre une décision difficile à défaire, et la raison qui l'a motivée.

## D'où viennent ces skills

Je n'ai pas tout écrit de zéro. La plupart des skills de planification, de construction et de relecture ont commencé comme une copie de [mattpocock/skills](https://github.com/mattpocock/skills). Je les ai renommés et modifiés depuis pour coller à ma façon de travailler et à ma pile.

Trois skills viennent d'autres projets :

- `angular-developer` vient de [angular/skills](https://github.com/angular/skills) ;
- `impeccable` vient de [pbakaus/impeccable](https://github.com/pbakaus/impeccable) ;
- `find-skills` vient de [vercel-labs/skills](https://github.com/vercel-labs/skills).

Le skill `pr` a aussi un fichier `CREDITS.md` : sa section de résumé visuel reprend le skill `show-me` de Dex Horthy (HumanLayer).

Le dépôt [musanzi/skills](https://github.com/musanzi/skills) est sous licence MIT. Vous pouvez le cloner, le forker et l'adapter.

## À retenir

- Un agent sans processus improvise les décisions que personne n'a prises. Le workflow les fait prendre au bon moment et en garde la trace.
- Le flux principal va de `/grill-with-docs` à `/retro` en huit étapes ; pour un petit changement, on saute la spécification et les tickets.
- Un skill manuel ne se lance que si vous tapez son nom ; un skill automatique peut être lancé par Claude ou par un autre skill.
- La zone efficace, environ 150 000 jetons, est la vraie limite d'une session. Le workflow est conçu pour y rester.
