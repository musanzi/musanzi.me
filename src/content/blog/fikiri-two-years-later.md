---
title: 'Fikiri Two Years Later'
description: 'What rebuilding my first professional platform taught me about maintainability, client trust, data migration, and using AI under a ten-day deadline.'
publishedAt: 2026-09-03
author: 'Wilfried Musanzi'
tags:
  - Software Engineering
  - Angular
  - NestJS
  - AI
---

Two years after delivering my first professional project, I received a call from the same client. He wanted me to build its second version.

I was happy, and I was proud. When someone calls you again after your first job, it usually means you are technically capable, easy to work with, or both. In my case, I think another factor mattered too: I had built the first version, so I already understood the product and the decisions hidden inside its code.

The product was Fikiri, a platform built for a [United Nations Development Programme](https://www.undp.org/) initiative in the Democratic Republic of the Congo. An administrator launches a call for solutions, people submit their ideas, reviewers evaluate them, and the administrator selects the winners. [Mr Olivier Bampendi](https://www.linkedin.com/in/olimuf/), who led the innovation and digital transformation work behind the platform, asked me to return for V2.

We had also kept talking after the first project ended. That relationship reminded me that clients do not hire code. They hire people they trust to understand a problem, communicate well, and finish the work.

![The redesigned Fikiri public landing page](../../assets/fk-1.png)

## Meeting the developer I was two years ago

Opening the old codebase was like meeting a younger version of myself.

Some decisions made me laugh. I looked at the code and wondered, “What was I thinking?” I deleted unnecessary methods, relationships, fields, and features. V1 had been experimental and built as we went, before the shape of the product and its data was completely clear. Some of that uncertainty had naturally found its way into the implementation.

Other decisions made me proud. The application still had a structure I could navigate.

The API used NestJS, whose module-based organization made it easy to locate behavior, debug it, and add features in predictable places. The V1 frontend, however, was split between two frameworks. A colleague who later left the project had built the administration dashboard with Next.js, while I had built the user-facing application with Angular.

By the time I started V2, my understanding of Angular had grown considerably. I brought the admin, reviewer, and user experiences into one Angular application, organized each role around its own layout and feature areas, and separated data access, features, interfaces, and UI inside those areas. Designing this new architecture made me realize that I did not need an Nx monorepo to structure the application well. Clear boundaries inside a single Angular project gave me the organization I needed without adding monorepo complexity.

I had also continued working with Angular and NestJS during those two years. The frameworks were familiar, but I had gained the experience to judge my earlier choices more effectively. Mastery compounded: the same technologies that helped me build V1 helped me rebuild it faster.

## V2 needed flexibility, not more hardcoded fields

The biggest limitation in V1 was its data model. Calls and solutions had fields hardcoded into their database entities and frontend forms. That worked while the first call was still defining what the platform needed to be, but every new variation required a code change.

V2 had to work more like Google Forms. An administrator should be able to define the form for a call, choose its fields, and collect answers without asking a developer to modify the database schema and redeploy the application.

I replaced the fixed call fields with a JSON form definition. Each field has its own identifier and metadata such as its label and type. A solution stores its answers in a JSON response object linked to those field identifiers. Labels and ordering can change without losing the relationship between a question and its answer.

There is a deliberate trade-off. An administrator can change a field's type even after people have submitted responses. When an existing answer no longer matches the requested type, the application ignores it and asks the user to enter a new value. This keeps form editing flexible, but it is not full schema versioning. If the product eventually needs an immutable historical view of every form, versioned definitions would be a better next step.

The same model powers evaluation. An administrator can build a multi-phase review form for example, an Evaluation phase followed by Curation with different questions in each phase. Reviewers see only the phases assigned to them.

Assignment is quota-based. When adding a reviewer, the administrator specifies how many solutions that person should receive, and the system draws from solutions not yet assigned in that phase. Each solution is reviewed by one reviewer per phase, and its score is computed from that reviewer's numeric answers. This prevents duplicate assignments and makes workload distribution simple, although it does not provide the score calibration that multiple independent reviews would offer.

## I rewrote only the half that needed rewriting

V2 did not become a complete rewrite.

I rebuilt the Angular application because the UI foundation had changed. V1 used PrimeNG, but [active development was moving toward PrimeUI's commercial model](https://github.com/primefaces/primeng) while previously released community versions remained MIT-licensed. I wanted a UI library that better matched my current workflow and the project's long-term needs, so I moved to Angular Material.

The new frontend uses Angular 22, signals for reactivity, NgRx Signal Store for feature state, and [`httpResource`](https://angular.dev/guide/http/http-resource) for reactive reads from the API. I retained the role and feature-oriented folder structure because it had already proved useful. The visual result changed substantially, but its organization still reflected what I had learned from V1.

The NestJS API was a different story. It was still a good foundation. Instead of rebuilding it, I removed unused behavior and relationships, then added the dynamic form, evaluation, assignment, and migration capabilities. Rewriting both applications would have introduced risk without giving the client equivalent value.

## The risky part was moving the data

Changing a form is easy when it has no users. Fikiri already had about 7,000 accounts and 430 submitted solutions.

The difficult part was moving that information from hardcoded columns into dynamic JSON responses without losing it. I kept the legacy database untouched and created a new database for V2. Then I built a dedicated NestJS migration module with two TypeORM data sources: one connected to the old schema and one to the new schema.

The migration read each legacy record, mapped its fixed fields to the identifiers in the new form definition, and wrote the transformed record to the new database. Keeping the source database intact gave me both a reference and a fallback while I verified the result.

The migration was smoother than I expected. I compared user and solution counts, checked names and profile relationships, compared old solution fields with their generated responses, and signed in with my own migrated account as a smoke test.

That validation was appropriate for the size and deadline of this project, but I would not describe it as a universal migration strategy. My login could not prove that every account was valid, and manual sampling becomes weaker as a dataset grows. For a larger or higher-risk migration, I would add automated reconciliation reports for counts, relationships, required values, and field-by-field transformations before cutover.

## Ten days, with a coding agent in the loop

The deadline was ten days. Two years earlier, I would have considered it unrealistic.

This time I had more experience and a new collaborator: [Codex](https://learn.chatgpt.com/docs). Because it worked inside an existing, conventionally structured codebase, I could give it strong context. I made the architectural and product decisions, and used Codex to accelerate implementation.

I did not manually inspect every generated line with equal attention. Instead, I worked feature by feature, tested whether the output matched the expected behavior, and checked that each part was well integrated. I still edited some areas myself when my knowledge of the code or the problem made that faster and safer.

That distinction matters. Codex improved my productivity; it did not understand the client relationship, choose the product model, or take responsibility for the delivery. Knowing how to code became an advantage, not an obsolete skill. It allowed me to provide useful context, recognize good output, catch weak decisions, and take over whenever necessary.

There is also a limit to outcome-based review. Code can appear to work while hiding maintainability or security problems. AI did not remove my responsibility to decide how much scrutiny each change required. The ten-day delivery was possible because I combined the tool's implementation speed with two years of accumulated understanding not because judgment had become optional.

## The result was more than a successful deployment

We delivered V2 within the deadline. The client was happy, launched a new call for solutions, thanked me, and began giving feedback from real use. We fixed the issues, moved forward, and users made the transition without major problems.

![The Fikiri V2 administration dashboard after launching a new call](../../assets/fk-2.png)

The dashboard soon showed the platform doing what it was rebuilt to do: managing new calls on top of thousands of migrated users and hundreds of solutions, without requiring another hardcoded workflow.

This project changed how I look at old code. A two-year-old codebase is not only a collection of mistakes waiting to be deleted. It is a record of what I knew, what the client needed at the time, and which decisions survived contact with reality. The goal was not to prove that I could write everything better from scratch. It was to identify what still worked, replace what constrained the product, and migrate the knowledge already captured in the system.

It also changed how I measure professional growth. Growth was visible in the cleaner architecture and faster implementation, but it was equally visible in the phone call itself. My first professional client came back because V1 worked, because I knew the platform, and because we had built a relationship that lasted beyond delivery.

Good code helped me earn the second project. Being someone the client wanted to work with again helped just as much.
