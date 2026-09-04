---
title: 'CINOLU OneStop'
summary: 'I delivered a unified platform that helps CINOLU manage programs and connects 2,800 entrepreneurs with opportunities.'
description: 'How I designed and shipped CINOLU OneStop, replacing fragmented program tools with one participant experience and administration platform.'
image: '../../assets/cinolu.png'
imageAlt: 'Conceptual dashboard for the CINOLU OneStop business platform'
role: 'Fullstack Engineer'
organization: 'CINOLU'
order: 2
featured: false
tags:
  - Angular
  - NestJS
  - Docker
  - Product Delivery
outcomes:
  - '2,800 entrepreneurs registered'
  - '10 programs administered through the platform'
  - 'One staff dashboard for program operations'
  - 'Participant and administration tools unified'
links:
  - label: 'Visit live site'
    url: 'https://cinolu.org'
    type: 'live'
  - label: 'Web repository'
    url: 'https://github.com/musanzi/cinolu.org'
    type: 'github'
  - label: 'API repository'
    url: 'https://github.com/musanzi/api.cinolu.org'
    type: 'github'
---

## Why we needed OneStop

[CINOLU](https://cinolu.org) runs programs that connect entrepreneurs with training, events, resources, and business opportunities. As those initiatives grew, participants had to move between disconnected tools to discover opportunities, register, follow activities, and access project resources.

Entrepreneurs had no single place to manage their participation. Staff also repeated the same administrative work across separate systems.

We built OneStop to bring that work together. Entrepreneurs use one account to find and join opportunities. Staff use one dashboard to create programs and manage participants.

## What I built

I worked with a UI/UX designer and handled the technical delivery. I designed the database, developed the [NestJS API](https://github.com/musanzi/api.cinolu.org), and built the [Angular participant and administration applications](https://github.com/musanzi/cinolu.org).

The administration dashboard lets staff create programs and manage the people taking part. Entrepreneurs can find opportunities and register without learning a different process for every program.

Both applications use the same API and data. CINOLU can launch programs with different goals without rebuilding registration and participation management each time.

## Running it in production

I packaged the applications with [Docker](https://docs.docker.com/) and deployed them to a virtual private server. I also handled the production environment after launch.

The platform has registered 2,800 entrepreneurs and supported 10 programs. We did not run a before-and-after time study, so I do not claim a percentage reduction in administrative work.

The most useful part of OneStop is simple. CINOLU no longer needs a separate registration process and participant list for every program.
