---
title: "Installer les skills et configurer un projet"
description: "Cloner le dépôt, relier les skills à Claude Code, lancer /setup-skills dans chaque projet et tenir l'installation à jour."
course: workflow-claude-code
order: 2
---

L'installation se fait en deux temps. Une fois par machine, vous clonez le dépôt et vous reliez les skills à Claude Code. Puis une fois par projet, vous lancez `/setup-skills` pour dire aux skills où vivent vos tickets et votre documentation de domaine.

## Une fois par machine

### Cloner le dépôt

Je garde les skills dans `~/.agents/skills`, en dehors de tout projet :

```sh
git clone https://github.com/musanzi/skills ~/.agents/skills
```

Chaque dossier du dépôt est un skill. `README.md` et `LICENSE` sont à la racine, à côté des dossiers.

### Relier chaque skill à Claude Code

Claude Code cherche les skills personnels dans `~/.claude/skills`. Plutôt que de copier les dossiers, je crée un lien symbolique par skill :

```sh
mkdir -p ~/.claude/skills
for dir in ~/.agents/skills/*/; do
	name=$(basename "$dir")
	[ -e ~/.claude/skills/"$name" ] || ln -s "$dir" ~/.claude/skills/"$name"
done
```

La boucle parcourt chaque dossier de `~/.agents/skills`, prend son nom et crée le lien `~/.claude/skills/<nom>` s'il n'existe pas déjà. Le test `[ -e ... ] ||` évite d'écraser un skill du même nom que vous auriez déjà installé : dans ce cas, la boucle passe au suivant sans rien toucher.

Les liens symboliques ont un avantage sur la copie : un seul dépôt git fait foi. Quand vous le mettez à jour, Claude Code voit la nouvelle version sans autre manipulation.

### Redémarrer Claude Code

Claude Code ne découvre les nouveaux skills qu'au démarrage. Quittez-le et relancez-le. Les skills apparaissent sans préfixe : `/grilling`, `/workflow`, `/to-spec`, et ainsi de suite.

Pour vérifier, tapez `/` dans Claude Code et cherchez `workflow` dans la liste.

## Une fois par projet : `/setup-skills`

Plusieurs skills ont besoin de savoir trois choses sur le dépôt où vous travaillez : où publier les tickets, quels libellés utiliser pour le tri, et où se trouvent le glossaire et les ADR. `/setup-skills` les enregistre. Lancez-le une fois, à la racine du projet, avant votre premier flux :

```text
/setup-skills
```

Ce n'est pas un script figé. L'agent explore d'abord le dépôt, vous présente ce qu'il a trouvé, puis vous pose les questions section par section, une réponse à la fois. Chaque question arrive avec une réponse recommandée, que vous pouvez accepter d'un mot.

### Ce que l'agent regarde avant de poser ses questions

- `git remote -v`, pour savoir si le dépôt est sur GitHub, GitLab ou ailleurs ;
- la présence de `CLAUDE.md` ou `AGENTS.md`, et d'une section `## Agent skills` existante ;
- `GLOSSARY.md`, `GLOSSARY-MAP.md` et les répertoires `docs/adr/` ;
- un éventuel `docs/agents/` laissé par une exécution précédente ;
- un répertoire `.scratch/`, signe qu'un suivi de tickets en Markdown local est déjà utilisé ;
- la présence du skill `triage` ;
- les signes d'un monorepo, comme `pnpm-workspace.yaml` ou un champ `workspaces` dans `package.json`.

S'il trouve les anciens noms `CONTEXT.md` ou `CONTEXT-MAP.md`, il propose de les renommer en `GLOSSARY.md` et `GLOSSARY-MAP.md` avec `git mv`.

### Section A : le gestionnaire de tickets

C'est là que `/to-spec`, `/to-tickets` et `/triage` lisent et écrivent. Quatre choix sont proposés :

| Choix | Où vivent les tickets | Outil utilisé |
| --- | --- | --- |
| GitHub | GitHub Issues du dépôt | la CLI `gh` |
| GitLab | GitLab Issues du dépôt | la CLI `glab` |
| Markdown local | des fichiers sous `.scratch/<fonctionnalité>/` | aucun |
| Autre (Jira, Linear…) | là où vous le décrivez | ce que vous décrivez en un paragraphe |

Les skills ont été pensés pour GitHub. Si votre `git remote` pointe vers GitHub, c'est ce que l'agent propose ; vers GitLab, il propose GitLab. Le Markdown local convient bien à un projet solo ou à un dépôt sans dépôt distant.

Si vous choisissez GitHub ou GitLab sans remote correspondant, l'agent vous demande l'URL du dépôt et le configure (`git init` si besoin, puis `git remote add origin <url>`). Il considère l'étape terminée quand `gh repo view` ou `glab repo view` affiche le projet.

Le choix est écrit dans `docs/agents/issue-tracker.md`. Ce fichier décrit les commandes exactes à utiliser : créer un ticket, lire ses commentaires, poser un lien de blocage entre deux tickets. Sur GitHub, par exemple, les blocages utilisent les dépendances natives des issues, visibles dans l'interface.

Le modèle GitHub et GitLab contient aussi un drapeau « PRs as a request surface », désactivé par défaut. S'il est activé, `/triage` traite les pull requests externes comme des demandes de fonctionnalité. L'agent ne vous pose pas la question ; vous pouvez changer le drapeau plus tard dans le fichier.

### Section B : les libellés de tri

Cette section n'apparaît que si le skill `triage` est installé. L'agent pose une seule question : garder les libellés par défaut ? Je réponds oui.

Les libellés par défaut correspondent aux cinq états du tri :

| Libellé | Sens |
| --- | --- |
| `needs-triage` | le mainteneur doit évaluer le ticket |
| `needs-info` | on attend des précisions de la personne qui l'a ouvert |
| `ready-for-agent` | spécifié, prêt pour un agent autonome |
| `ready-for-human` | demande une implémentation humaine |
| `wontfix` | ne sera pas traité |

Si votre gestionnaire utilise déjà d'autres noms, par exemple `bug:triage` à la place de `needs-triage`, répondez non et donnez la correspondance. `/triage` appliquera vos libellés existants au lieu de créer des doublons. Sur GitHub ou GitLab, l'agent crée les libellés qui manquent.

Le résultat va dans `docs/agents/triage-labels.md`.

### Section C : la documentation de domaine

Par défaut, l'agent choisit sans vous demander une organisation à **contexte unique** : un `GLOSSARY.md` et un répertoire `docs/adr/` à la racine. C'est ce qui convient à presque tous les dépôts.

Il ne propose l'organisation **multi-contexte** que s'il a détecté un monorepo. Dans ce cas, un `GLOSSARY-MAP.md` à la racine pointe vers un `GLOSSARY.md` par contexte, chacun avec ses propres ADR dans `src/<contexte>/docs/adr/`.

Le fichier `docs/agents/domain.md` explique aux autres skills comment lire ces documents. Une règle compte : si `GLOSSARY.md` ou les ADR n'existent pas encore, les skills continuent sans rien signaler. Ils sont créés plus tard, au moment où un terme ou une décision est vraiment tranché.

### Ce qui est écrit à la fin

Avant d'écrire, l'agent vous montre un brouillon de tout ce qu'il va créer, et vous pouvez le modifier. Puis il ajoute une section `## Agent skills` à `CLAUDE.md` s'il existe, sinon à `AGENTS.md`. Si aucun des deux n'existe, il vous demande lequel créer. Cette section contient trois pointeurs courts :

```markdown
## Agent skills

### Issue tracker

Issues live in GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Default labels. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. See `docs/agents/domain.md`.
```

Vous pouvez modifier les fichiers de `docs/agents/` à la main par la suite. Relancer `/setup-skills` n'est utile que pour changer de gestionnaire de tickets ou repartir de zéro.

## Mettre à jour

Pour récupérer mes dernières modifications, ou synchroniser une autre machine :

```sh
cd ~/.agents/skills
git pull
```

Les liens symboliques pointent vers les dossiers du dépôt, donc les skills existants sont à jour immédiatement. Si la mise à jour ajoute un nouveau skill, relancez la boucle de liens : elle ne crée que les liens manquants. Redémarrez ensuite Claude Code.

## À retenir

- Le dépôt vit dans `~/.agents/skills`, et chaque skill est relié par un lien symbolique dans `~/.claude/skills`.
- Redémarrez Claude Code après l'installation pour que les skills apparaissent.
- `/setup-skills` se lance une fois par projet et configure le gestionnaire de tickets, les libellés de tri et la documentation de domaine.
- La configuration vit dans `docs/agents/` et une section `## Agent skills` de `CLAUDE.md` ou `AGENTS.md`.
- `git pull` dans `~/.agents/skills` met tout à jour.
