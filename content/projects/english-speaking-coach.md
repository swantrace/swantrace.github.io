---
title: "English Speaking Coach"
description: "An AI speaking-practice application with live voice conversations, scenario-based role-play, and asynchronous language feedback."
tags: ["TypeScript", "React", "LiveKit", "Hono", "BullMQ", "Redis", "libSQL / Turso", "Drizzle"]
github: "https://github.com/swantrace/english-speaking-coach"
demo: "https://english-speaking-coach-2.vercel.app/"
demoNote: "The hosted app is a personal-use environment. Sign-in and configured services may be required; full functionality is not guaranteed for every visitor."
image: "/images/projects/english-speaking-coach.svg"
imageAlt: "Abstract audio waveform connected to a separate language-analysis flow."
category: "AI application"
status: "Active personal project"
role: "Full-stack design and implementation"
featured: true
draft: false
sourceVisibility: public
order: 2
---

## At a glance

English Speaking Coach gives learners a place to practise spoken English through live conversations. Scenario-based role-play introduces goals, such as ordering a meal, while free conversation lets learners explore a topic naturally. Language feedback helps turn a conversation into material they can review afterwards.

I designed and built this personal application across the React interface, backend APIs, voice agent, data model, and background workers. The engineering challenge is keeping conversation responsive while slower AI analysis and content generation happen independently.

## What I built

- A React and TypeScript interface for practice sessions, reusable scenarios, conversation history, and language feedback.
- A LiveKit voice agent handling speech recognition, AI responses, speech synthesis, and structured goal tracking.
- A Hono backend for authentication, application data, session coordination, and asynchronous work.
- BullMQ and Redis workers for language analysis, scenario generation, and related learning workflows.
- Shared TypeScript contracts and Zod schemas in a pnpm/Turborepo monorepo.
- Persistence through **libSQL / Turso (SQLite-compatible) and Drizzle ORM**, with local SQLite/libSQL configuration.

## The main decision: separate conversation from assessment

A learner needs the next conversational response immediately. Analysing grammar, vocabulary, and a completed transcript can take longer. Keeping both tasks on the same request path would make the speaking experience depend on the slowest analysis operation.

The LiveKit agent owns the next conversational turn. Workers handle assessments that can arrive later, including feedback produced while a conversation continues and fuller analysis after it ends. The interface can present results progressively rather than waiting for one large response.

```text
React application ←→ LiveKit voice agent
        │                     │
        └────── Hono API ──────┘
                    │
             BullMQ / Redis
                    │
             Analysis workers
                    │
          libSQL / Turso + Drizzle
```

This introduces queue state and service coordination, but lets voice interaction and assessment evolve separately.

## Shared contracts and private learning data

The web app, backend, agent, and workers share validation schemas and types. Runtime validation matters at AI and queue boundaries, where a successful request does not guarantee usable structured output.

Practice history and media also need ownership boundaries. The application uses authenticated access and short-lived links for private media, rather than treating learning material as permanently public files. Portfolio illustrations show concepts; they do not depict a learner's private conversations or recordings.

## Reliability and validation

Background processing is assessed per workflow. Stable job identifiers, validation, persisted state, and retained failure information help diagnose errors and reduce duplicate work. These safeguards do not establish an exactly-once processing guarantee; partial writes and external side effects need their own handling.

TypeScript, Vitest, repository quality checks, and repeatable development workflows support ongoing changes. Further evaluation will measure concurrent-session behaviour, queue capacity, model-provider limits, recovery policies, and database writes as usage grows.

## Outcome

The result is a working personal practice tool spanning real-time communication, full-stack product workflows, and asynchronous AI processing. It demonstrates how I connect a user-facing product to service boundaries, runtime contracts, and operational concerns, while keeping the limitations of a personal deployment explicit.
