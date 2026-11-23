---
title: "Mon workflow avec Claude Code : de l'idée au déploiement"
description: "Installer et utiliser mes skills Claude Code pour mener une fonctionnalité de l'idée floue à la pull request fusionnée, avec un agent qui interroge, spécifie, teste et relit."
publishedAt: 2026-11-23
tags: [Claude Code, IA, Workflow, Agents]
sourceUrl: "https://github.com/musanzi/skills"
cover:
  title: 'Mon workflow avec Claude Code'
  subtitle: "De l'idée floue à la pull request fusionnée"
---

Ce cours s'adresse aux développeurs qui utilisent déjà Claude Code et qui voient l'agent foncer vers le code avant que l'idée soit claire, oublier une décision prise une heure plus tôt ou livrer un diff que personne n'a vraiment relu. Je vous montre comment je travaille au quotidien : un ensemble de skills qui découpe le travail en étapes, de l'interrogatoire sur l'idée jusqu'à la description de la pull request.

À la fin, vous saurez installer mes skills, configurer un projet avec `/setup-skills`, faire passer une fonctionnalité par le flux principal (`/grill-with-docs`, `/to-spec`, `/to-tickets`, `/implement`, `/spec-review`, `/pr`, `/retro`) et décider quand vider ou compacter le contexte entre deux phases. Vous saurez aussi quand sortir du flux : diagnostiquer un bug difficile, trier des tickets entrants, cartographier un chantier trop gros pour une seule session.

Il vous faut Claude Code installé, git, et un compte GitHub, car les skills suivent les tickets sur GitHub par défaut (GitLab et des fichiers Markdown locaux sont aussi pris en charge). Ma pile est NestJS côté serveur et Angular côté client, et certains skills sont écrits pour elle. Le reste du workflow ne dépend d'aucun framework : le dernier chapitre explique comment l'adapter au vôtre.

Tout est open source, dans le dépôt [musanzi/skills](https://github.com/musanzi/skills). La plupart des skills de planification, de construction et de relecture sont partis d'une copie de [mattpocock/skills](https://github.com/mattpocock/skills), puis je les ai renommés et modifiés. `angular-developer` vient de [angular/skills](https://github.com/angular/skills), `impeccable` de [pbakaus/impeccable](https://github.com/pbakaus/impeccable) et `find-skills` de [vercel-labs/skills](https://github.com/vercel-labs/skills). Merci à leurs auteurs.
