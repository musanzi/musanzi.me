---
title: 'Fikiri Innovation Platform'
summary: 'I led the development of a UNDP innovation platform used by more than 7,500 registered accounts, then returned to rebuild its core workflows.'
description: 'How I built Fikiri, returned two years later to make it more flexible, and migrated thousands of existing accounts before the next call for solutions.'
image: '../../assets/fikiri.png'
imageAlt: 'Conceptual dashboard for the Fikiri innovation platform'
role: 'Project Lead & Fullstack Engineer'
organization: 'UNDP Innovation Lab'
period: 'Nov 2023 to Jun 2024 · Aug to Sep 2026'
order: 1
featured: true
tags:
  - Angular
  - NestJS
  - PostgreSQL
  - Docker
outcomes:
  - '7,500+ registered accounts across the platform'
  - '430 existing solutions migrated to a flexible data model'
  - '86 solutions assigned to 8 reviewers in the first V2 call'
  - 'Launch-critical V2 workflow delivered in 4 days'
links:
  - label: 'Visit live site'
    url: 'https://fikiri.co'
    type: 'live'
  - label: 'Web repository'
    url: 'https://github.com/cinolu-software/fikiri.co'
    type: 'github'
  - label: 'API repository'
    url: 'https://github.com/cinolu-software/api.fikiri.co'
    type: 'github'
---

## What Fikiri does

[Fikiri](https://fikiri.co) was created for the [UNDP in the Democratic Republic of the Congo](https://www.undp.org/fr/drcongo). The Innovation Lab needed one place to publish calls for solutions, receive applications, assign submissions to reviewers, calculate scores, and select promising innovations.

I worked directly with the UNDP Innovation Lab as an independent contractor while employed by CINOLU. I led a team of two developers and handled client discussions, architecture, and delivery. I designed the database, built the NestJS API and entrepreneur-facing Angular application, and managed the production server. The other developer built the administration dashboard.

The first version ran from November 2023 to June 2024. It processed more than 400 applications and supported the structured selection of eight winning projects. It also grew from roughly 1,000 to more than 7,500 registered accounts.

Each account had a referral code. When somebody registered through a referral link, I stored the referrer's email on the new account. This let us trace approximately 6,500 registrations back to referrals.

## Why we built V2

We built V1 while the first call was still taking shape. Its application fields were written directly into the database and frontend forms. It worked for the first call, but any change to the questions required a code change and a new deployment.

When UNDP invited me back for V2, they wanted to manage calls, application forms, evaluation phases, reviewers, and scores themselves.

I replaced the fixed fields with a form definition stored as JSON. Each question has a stable identifier and metadata such as its label and type. Applications store responses against those identifiers, allowing an administrator to change labels or ordering without breaking existing answers. The implementation lives across the public [Angular repository](https://github.com/cinolu-software/fikiri.co) and [NestJS API repository](https://github.com/cinolu-software/api.fikiri.co).

I used the same model for evaluations. Administrators define the questions for each phase and choose how many solutions each reviewer receives. The assignment logic selects solutions that have not yet been assigned in that phase and calculates scores from the reviewer's numeric answers.

## Keeping the API and rebuilding the frontend

I kept the existing NestJS API because its module structure was still easy to work with. I removed unused methods and relationships, then added the new forms, reviews, assignments, and migration code.

I rebuilt the frontend and brought the user, reviewer, and administration areas into one [Angular](https://angular.dev/overview) application. I organized it by role and feature, replaced PrimeNG with [Angular Material](https://material.angular.dev/), and used [Angular signals](https://angular.dev/guide/signals), [NgRx Signal Store](https://ngrx.io/guide/signals), and [`httpResource`](https://angular.dev/guide/http/http-resource).

V1 deployments were manual. For V2, I used [GitHub Actions](https://docs.github.com/en/actions) and [Docker](https://docs.docker.com/). The workflow connects to the server with a restricted deployment account, rebuilds the application, and restarts it. I no longer need to log in as root for routine deployments.

## Migrating thousands of live records

The riskiest part was moving approximately 7,000 accounts and 430 submitted solutions from fixed database columns into the new response model.

I kept V1 and its database intact, created a separate V2 database, and backed up the data before migration. A dedicated NestJS module connected to both schemas, mapped every legacy field to its new form identifier, and copied password hashes without exposing plaintext passwords.

I first migrated a sample and inspected the result. For the full run, I compared account and solution totals, checked names and profile relationships, matched old values against the generated responses, and signed in with a migrated account. I left the old database unchanged so I could compare records or roll back if needed.

## Working against the launch date

The engagement ran from 15 August to 3 September 2026. The next call could not wait for the entire redesign, so I split delivery into launch-critical phases. Dynamic call forms and the submission workflow shipped after four days; reviewer and evaluation features completed the ten-day core build.

We reviewed progress with the client every day. During the feedback period, I worked on performance, added CSV exports for solutions, and fixed a password reset issue. I did not benchmark the performance work, so I have left out percentage claims.

The first V2 call brought in more than 151 users and 86 solutions. All 86 were assigned across eight reviewers through the new workflow. Review completion details remain private.

This second version showed me how much of the job is deciding what to leave alone. Keeping the API saved time. Rebuilding the frontend removed a real constraint. Testing the migration in stages protected data that thousands of people already depended on.
