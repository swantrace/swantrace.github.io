---
title: "English Speaking Coach"
description: "A full-stack speaking-practice application built around live sessions, durable background analysis, deterministic jobs, and observable failure handling."
tags: ["TypeScript", "React", "Hono", "BullMQ", "Redis", "PostgreSQL", "Drizzle"]
featured: true
draft: false
sourceVisibility: private
sourceNote: "Source code is private. This is a personal project built with AI-assisted development; the architecture and implementation decisions described here have been reviewed and understood by me."
order: 2
---

## At a glance

English Speaking Coach is an active personal project for guided speaking practice. It combines a browser application, a live-session agent, an HTTP API, and background workers that turn session data into transcripts, linguistic analysis, and follow-up learning material.

The engineering focus is not only the AI interaction. It is making asynchronous work predictable when requests are duplicated, workers fail, or one analysis step depends on another.

## Context and problem

A live conversation has a latency-sensitive path and a much slower analysis path. Persisting transcripts, evaluating a completed session, resolving learning points, and generating new practice scenarios should not block the conversation or depend on one long HTTP request remaining open.

The application therefore needed clear service boundaries, durable jobs, progress feedback, and a way to investigate failure after a worker exits.

## My role

This is my personal full-stack project. I designed the application boundaries, implemented and reviewed the code, and remain responsible for understanding and maintaining it.

I use AI-assisted development as part of the implementation workflow. AI helps accelerate scaffolding, exploration, and review, but I validate the resulting behavior and do not present generated code as evidence of knowledge I cannot explain.

## What I built

- A TypeScript monorepo separating the web client, API, live-session agent, shared contracts, domain rules, database access, prompts, and object storage
- BullMQ queues and Redis-backed workers for session completion, linguistic analysis, scenario generation, and knowledge processing
- PostgreSQL persistence through Drizzle, including explicit job and analysis state
- Shared runtime schemas and DTOs so producers and consumers agree on job payloads
- Server-sent progress events for long-running generation workflows
- Worker completion and failure logging with job context
- Unit and integration tests around agent behavior, storage, contracts, and backend workflows

## Architecture

```text
React web client
    │ HTTP + live-session events
    ├──────────────► Hono API ─────────► PostgreSQL
    │                    │
    │                    ▼
    │               BullMQ / Redis
    │                    │
    │                    ▼
    └──────────────► background workers
                         │
                         ├── transcript persistence
                         ├── linguistic analysis
                         ├── knowledge processing
                         └── scenario generation

Live-session agent ─────► session events and transcript batches
```

Shared contract packages define the data crossing these boundaries. This reduces the chance that a producer can enqueue a payload a worker interprets differently.

## Key decisions and trade-offs

### Separate the API process from workers

The API accepts and validates requests, while workers own slow or failure-prone analysis. This keeps request latency independent of model calls and makes failed work inspectable. The cost is more infrastructure and more lifecycle states to model.

### Use deterministic downstream job IDs

Jobs derived from a stable entity use IDs such as an analysis name plus the session ID. Repeating the upstream completion step therefore targets the same logical downstream work instead of silently creating an unlimited number of equivalent jobs.

This is one layer of idempotency, not a claim that every operation is automatically idempotent. Database writes and external side effects still need their own safeguards.

### Retain failed jobs

Successful jobs can be removed, while failed jobs remain available for diagnosis. Workers also write concise failure records containing the job, queue, and attempt context. This uses more storage than discarding every completed record, but provides much better evidence when debugging asynchronous failures.

### Persist before scheduling the next stage

For session completion, the worker validates the job, verifies the session, persists the final transcript, marks completion, and only then enqueues linguistic analysis. The explicit sequence is easier to reason about than a hidden chain of callbacks, although production hardening would still benefit from transactional outbox semantics.

## Reliability, testing, and observability

- Runtime schemas validate work at API and queue boundaries.
- Deterministic job IDs reduce duplicate downstream scheduling.
- Worker listeners record successful and failed execution.
- Failed jobs are retained instead of being removed immediately.
- Job and request status is persisted for administrative inspection.
- Tests cover selected agent, storage, contract, and workflow behavior.

There is no production reliability metric yet. These are implementation safeguards observed in local development, not a measured availability claim.

## Security

Authentication and authorization checks are enforced at API route boundaries, while internal agent routes use a separate internal authorization path. Secrets and infrastructure services are configured outside client code. Before public deployment, I would add a formal threat model, rate limits, secret rotation procedures, and automated authorization tests for every role boundary.

## Outcome

In the current application workflow, completing a speaking session can hand off transcript persistence and downstream analysis without keeping the interactive request open. Operators can inspect queued, started, completed, and failed work instead of treating background processing as a black box.

Because this is an active personal project, I describe demonstrated behavior rather than production adoption or performance metrics.

## Source availability

Source code is private. This case study shares the architecture and the decisions I can explain publicly without presenting the repository as independently authored without tooling assistance.

## What I would improve next

- Introduce a transactional outbox between database state changes and queue publication
- Define retry and backoff policy per job type, based on whether a failure is transient
- Add distributed tracing and correlation IDs across API, agent, queue, and model calls
- Expand end-to-end tests for duplicate delivery and mid-chain failure recovery
- Document data retention and deletion rules for audio, transcripts, and model request logs
- Measure queue latency and completion rates before making performance claims
