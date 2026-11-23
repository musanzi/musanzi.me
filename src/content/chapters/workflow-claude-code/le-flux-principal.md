---
title: "Le flux principal"
description: "/workflow comme carte, les étapes de l'idée à la livraison, les embranchements, les bretelles d'accès et la gestion du contexte entre les phases."
course: workflow-claude-code
order: 3
---

Quand je ne sais pas quel skill lancer, je tape `/workflow`. C'est un skill manuel qui ne produit rien : il me sert de carte. Il dit quel skill correspond à la situation, quand vider ou compacter le contexte, et quels skills de ma pile charger avant d'écrire du code.

`/workflow` demande lui-même à l'agent de lire le `SKILL.md` d'un skill avant de dire ce qu'il fait ou de recommander de sauter une étape. Les résumés de la carte servent à s'orienter, pas à décider.

## Le flux principal, étape par étape

Le flux principal est le chemin de la plupart de mes fonctionnalités. J'ai une idée, je veux qu'elle soit construite.

### 1. Aiguiser l'idée avec `/grill-with-docs`

Je commence ici dès que je travaille dans un dépôt. L'agent m'interroge par séries de questions jusqu'à ce qu'on partage la même compréhension, et il note au fil de l'eau les termes dans `GLOSSARY.md` et les décisions importantes dans des ADR.

Hors d'un dépôt, par exemple pour réfléchir à un plan ou à un texte, j'utilise `/grilling`. C'est le même interrogatoire, sans trace écrite. Dès qu'il y a un dépôt, `/grill-with-docs` est le meilleur des deux.

### 2. Embranchement : tout se règle-t-il en conversation ?

Certaines questions ne se tranchent pas sur le papier. Est-ce que ce modèle d'états tient la route ? À quoi doit ressembler cet écran ? Dans ce cas, je fais un détour par `/prototype`, qui répond à la question avec du code jetable. Je ramène ensuite la réponse dans la conversation, et l'interrogatoire reprend.

### 3. Embranchement : est-ce un chantier sur plusieurs sessions ?

**Oui.** Je lance `/to-spec` pour transformer la conversation en spécification, puis `/to-tickets` pour la découper en tickets. Chaque ticket est une tranche verticale (*tracer bullet*) et déclare ses bords bloquants (*blocking edges*), c'est-à-dire les tickets qui doivent être terminés avant lui. Ensuite, deux façons de construire :

- `/implement` ticket par ticket, avec un `/clear` entre chaque. Chaque ticket se suffit à lui-même, donc le contexte du précédent ne sert plus.
- `/implement-spec` pour toute la spécification d'un coup. Il lit les tickets comme un graphe de tâches, lance des sous-agents en parallèle sur ceux qui sont prêts, et fusionne tout sur une branche d'intégration. Je le choisis quand je préfère orchestrer plutôt que conduire chaque ticket moi-même.

**Non.** Je lance `/implement` directement, dans la même fenêtre de contexte, sans spécification ni tickets.

Dans les deux cas, le code est construit avec `/tdd`, une tranche rouge-vert à la fois, et se termine par `/spec-review`, qui relit le diff selon deux axes : les règles de code et la spécification. Quand le travail part en pull request, `/pr` rédige la description. Comme c'est un skill automatique, l'agent l'utilise de lui-même dès qu'il écrit une pull request.

### 4. Boucler avec `/retro`

Après une construction, surtout si elle s'est mal passée, `/retro` relit la session et propose des améliorations à l'environnement de l'agent : pointeurs de navigation, vérifications automatiques, règles de code, outils. Les erreurs mécaniques deviennent des vérifications automatiques ; les questions de jugement deviennent des règles de code. La construction suivante part d'un meilleur environnement.

## Les bretelles d'accès

Une bretelle d'accès (*on-ramp*) part d'une autre situation que « j'ai une idée », produit du travail, puis rejoint le flux principal.

| Situation | Skill | Où ça rejoint le flux |
| --- | --- | --- |
| Des bugs et des demandes s'accumulent | `/triage` | les tickets `ready-for-agent` sont repris par `/implement` |
| Quelque chose est cassé, et ce n'est pas évident | `/diagnosing-bugs` | correctif avec test de régression, puis `/retro` |
| Un chantier énorme et flou, trop gros pour une session | `/wayfinder` | `/to-spec` quand la carte est dégagée |

Deux précisions comptent. `/triage` ne sert qu'aux tickets que vous n'avez pas créés : rapports de bug, demandes entrantes. Les tickets produits par `/to-tickets` sont déjà prêts pour un agent, il ne faut pas les trier.

Et `/wayfinder` ne construit rien. Il produit des décisions. Quand sa carte est claire, il passe la main à `/to-spec`, qui condense les décisions liées en un plan constructible. Aller directement de la carte à `/implement` jette ce détail ; je ne le fais que si le chantier s'est révélé petit.

## Garder le contexte propre

### Les étapes 1 à 3 dans une seule fenêtre

Je garde l'interrogatoire, la spécification et les tickets dans une seule fenêtre de contexte, sans `/clear` ni `/compact` avant la fin de `/to-tickets`. Ainsi la spécification et les tickets s'appuient sur le raisonnement d'origine, pas sur un résumé. Ensuite, chaque `/implement` repart à zéro à partir du ticket.

`/retro` se lance dans la session qu'il analyse, avant de vider le contexte. Si c'est trop tard, on peut lui indiquer le journal de cette session.

### La zone efficace

La limite de cette règle est la zone efficace : environ 150 000 jetons, la partie de la fenêtre où le modèle raisonne encore avec précision. Si une session s'en approche avant `/to-tickets`, je ne continue pas en mode dégradé. Je fais un `/compact` à la prochaine frontière de phase et je reprends.

## Les frontières de phase

Une phase est un morceau de travail dans une session : l'interrogatoire, l'implémentation, la vérification. La définition est floue exprès : une phase se termine quand vous pensez « bon, c'est fait ». La frontière est le moment entre deux phases, et c'est le seul moment où l'on décide quoi faire du contexte. En milieu de phase, on continue, ou on confie le reste à des sous-agents.

### Les quatre options

| Option | Ce qu'elle fait |
| --- | --- |
| Continuer | rester dans la session, sans rien changer |
| `/clear` | vider la fenêtre de contexte et repartir de rien |
| Sous-agent | envoyer une tâche dans sa propre fenêtre et récupérer un rapport |
| `/compact` | compresser le contexte et démarrer une session à partir du résumé |

### L'arbre de décision

À la frontière, je me pose quatre questions dans l'ordre. La première réponse « oui » l'emporte.

1. **Puis-je continuer dans cette session ?** Oui si la phase suivante a besoin de celle-ci comme source primaire, ou s'il reste assez de zone efficace pour qu'elle tienne. Le passage de l'interrogatoire à l'implémentation est le cas typique : l'implémentation veut le raisonnement tel quel, pas un résumé.
2. **Le contexte est-il inutile pour la suite ?** Si tout est jetable, `/clear`. C'est l'option la moins chère, et l'ancienne session reste accessible. Attention, l'erreur est à sens unique : vider un contexte utile fait perdre le *pourquoi* de ce qu'on a construit, et le diff ne le rend pas.
3. **La tâche peut-elle tourner sans moi ?** Si elle est assez cadrée pour s'exécuter sans pilotage, je l'envoie à un sous-agent. La relecture automatique est le cas classique.
4. **Sinon, `/compact`.** Je lui donne une consigne pour que le résumé garde l'essentiel, par exemple `/compact we're going to QA this area`.

`/compact` est l'option par défaut, mais pas le premier réflexe. Il arrive en dernier parce que les trois questions précédentes sont moins chères ou plus précises. Le risque quand on commence par lui : une session neuve, sûre d'elle, qui se trompe sur une décision que le résumé a aplatie.

### Source primaire, source secondaire

Toutes les options sauf « continuer » remplacent une source primaire (la session telle qu'elle s'est déroulée) par une source secondaire (un résumé). Le résumé contient moins de bruit et laisse plus de place, mais il perd de l'information. C'est pour ça que la première question est « puis-je continuer ? » : on ne paie cette perte que quand rester coûte plus cher que partir.

Ces questions demandent du jugement. La même frontière peut se trancher différemment deux jours de suite. Ce qui compte, c'est de se les poser dans l'ordre, et à la frontière.

## Avant tout : `/setup-skills`

La carte rappelle une condition préalable : `/setup-skills` doit avoir tourné dans le projet avant le premier flux d'ingénierie. Sans lui, `/to-spec`, `/to-tickets` et `/implement-spec` vous demanderont de le lancer.

## À retenir

- `/workflow` est une carte : il dit quel skill lancer et quand gérer le contexte, il ne produit rien.
- Le flux principal a deux embranchements : un détour par `/prototype` si la conversation ne suffit pas, et le choix entre spécification et tickets ou `/implement` direct selon la taille du chantier.
- Trois bretelles d'accès rejoignent le flux : `/triage`, `/diagnosing-bugs` et `/wayfinder`.
- Gardez l'interrogatoire, la spécification et les tickets dans une seule fenêtre, et restez dans la zone efficace.
- À une frontière de phase, demandez-vous dans l'ordre : continuer, `/clear`, sous-agent, puis `/compact`.
