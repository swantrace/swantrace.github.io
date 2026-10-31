---
title: "Job Application Tracker"
description: "A local-first application connecting job tracking, evidence-based AI analysis, human review, and traceable resume and cover-letter generation."
tags: ["TypeScript", "Bun", "HonoX", "htmx", "SQLite", "Drizzle", "Bunqueue", "Zod"]
github: "https://github.com/swantrace/job-hunting"
image: "/images/projects/job-application-tracker.svg"
imageAlt: "Abstract job documents moving through analysis and review into a generated document."
category: "AI workflow application"
status: "Active personal project"
role: "Product design and full-stack development"
featured: false
draft: false
sourceVisibility: public
order: 4
---

## At a glance

Job Application Tracker brings application tracking, job-description analysis, career evidence, and document generation into one personal workflow. It helps a user understand a role, review how their experience relates to its requirements, and prepare targeted resumes and cover letters.

I built the product with TypeScript, Bun, HonoX, htmx, SQLite, and Drizzle. Server-rendered pages and HTML fragment updates keep the interface close to the application's persisted state, while long-running AI tasks run in the background.

## Make AI output reviewable

A document is useful only if its claims can be traced to real career information. The application retains the career facts, requirement evidence, user decisions, and generation inputs associated with a run. Prompt and schema versions help explain how a particular result was produced.

Users review uncertain matches and make explicit Include/Skip decisions before generating documents. AI suggestions remain inputs to that review rather than silently becoming approved career facts.

```text
Job posting + career evidence
             │
             ▼
      Structured AI analysis
             │
             ▼
      User review and decisions
             │
             ▼
    Resume / cover-letter generation
             │
             ▼
      DOCX + generation record
```

## What I built

- Application tracking with list and board views, priorities, activities, and posting history.
- Job intake and structured analysis connecting requirements to career evidence.
- Human review of uncertain matches before document generation.
- Targeted resume and cover-letter generation with retained evidence-selection snapshots.
- SQLite-backed background workflows, persisted progress, and recovery handling.
- A public repository for local setup; no public live deployment is advertised.

## Key decisions and reliability work

### Persist business state independently of the browser

AI calls and document creation can outlast an HTTP request. Persisted run state lets the interface report progress after a reload and gives failures a durable record. Htmx updates the relevant page fragments without holding the user on a model request.

### Control concurrency at more than one level

When batch processing exposed slow or apparently stuck work, I investigated worker concurrency and provider requests separately. Increasing worker slots from one to three allowed more jobs to advance, while a shared provider limiter bounded concurrent AI calls within the process.

More workers alone would not solve provider limits, and a process-local limiter is not a global distributed limit. That boundary matters when considering multiple application instances.

### Recover interrupted work without promising exactly-once execution

I addressed runs left in a Processing state after an application interruption and improved startup recovery. The current repository documents persisted workflow delivery and recovery through its SQLite-backed engine.

Recovery can require another external request when a process exits mid-call. Retry and recovery behaviour therefore needs to distinguish failed model runs, interrupted execution, and user-requested reruns. The application does not guarantee exactly-once model billing.

## Outcome

The result is a working personal application where AI analysis feeds a reviewable business workflow. Its value is both product-level—keeping a job search organized—and architectural: preserving the evidence and decisions behind generated documents while handling slow and interrupted work.

Public case-study material uses conceptual illustrations. Any future application screenshots must use fictional employers, vacancies, career information, and application records.
