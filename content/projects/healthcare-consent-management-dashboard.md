---
title: "Healthcare Consent Management Dashboard"
description: "Frontend engineering contributions to a production healthcare consent platform, including React workflows, GraphQL integration, browser tests, and a Vite migration."
tags: ["React", "TypeScript", "GraphQL", "Redux", "Material UI", "Playwright", "Vite"]
featured: true
draft: false
sourceVisibility: private
sourceNote: "Source code and screenshots are private. Architecture and implementation decisions are shared at a level permitted for this professional team project."
order: 3
---

## At a glance

This case study covers my frontend contributions to a professional healthcare consent platform. The product included separate consumer and administrative React applications, shared frontend logic, GraphQL-backed workflows, and browser-level integration tests.

The source, screenshots, customer information, and environment details are private. The discussion is intentionally limited to my verified contribution and high-level engineering decisions.

## Context and problem

Consent software has to support more than a single form. Consumer and administrative users move through authentication, consent capture, document review, settings, and management workflows, with state shared across multiple screens and backend operations.

The frontend codebase also needed to evolve without interrupting ongoing product work. Build performance and maintainability mattered, but tooling migration could not become a rewrite of application behavior.

## My role

I worked on this codebase as a contributor within a team. I contributed frontend workflows, Playwright-backed integration tests, and the migration of the frontend build tooling to Vite. I also implemented selected GraphQL APIs in the related backend.

I did not own the entire product architecture, backend, infrastructure, or design system. Team outcomes are described as team outcomes; the implementation items above are my contribution.

## What I built

- React and TypeScript workflows used across consent-management screens
- GraphQL-connected UI behavior and selected supporting GraphQL API work
- Shared frontend utilities and components within a multi-package repository
- Browser-level integration tests using CodeceptJS with Playwright
- Vite build configuration for the consumer and administrative applications
- Fixes and incremental improvements across forms, navigation, localization, responsive behavior, and dependency maintenance

## Architecture

```text
Consumer React app ──┐
                     ├──► shared frontend package
Admin React app ─────┘             │
       │                           │
       └──────── GraphQL operations│
                    │              │
                    ▼              │
             consent platform APIs

CodeceptJS + Playwright
       └────────► browser-level workflows across the deployed UI
```

The repository separated the two applications from common logic while allowing each app to keep its own entry point, environment configuration, and build output.

## Key decisions and trade-offs

### Migrate build tooling without rewriting product behavior

The Vite migration preserved the existing React application structure and environment-variable convention while replacing the build and development tooling. Compatibility settings were kept where necessary so the change could be introduced incrementally.

This reduced migration risk, but it also meant accepting some legacy conventions rather than redesigning the entire frontend at the same time.

### Test user workflows in a real browser

The integration suite exercised the application through CodeceptJS backed by Playwright. Browser-level tests are slower and require configured environments, but they cover routing, rendering, and backend interaction in a way isolated component tests cannot.

### Share code between consumer and admin applications

A common package reduced duplication for behavior used by both applications. The trade-off is that shared changes need careful compatibility review because they can affect two independently deployed experiences.

## Reliability, testing, and observability

My testing contribution focused on Playwright-backed integration coverage for important user workflows. The suite could run against local applications or a configured deployed environment, making it useful for checking integration behavior across the actual browser and GraphQL boundary.

The case study does not claim a coverage percentage or defect reduction because I do not have a verified measurement suitable for publication.

Frontend error handling and user feedback were part of individual workflows, while infrastructure and organization-wide production observability were team responsibilities outside the scope of this public description.

## Security and privacy

The applications worked with authentication and healthcare-consent data, so configuration and access boundaries were environment-specific. This public case study intentionally excludes credentials, endpoint details, screenshots, customer data, and internal implementation specifics.

Browser code cannot be trusted as the final authorization boundary. Permission enforcement and sensitive operations must remain in the backend, with the UI reflecting—not replacing—those controls.

## Outcome

The work supported ongoing delivery of consumer and administrative consent workflows in a professional production codebase. The Vite migration modernized the frontend toolchain while preserving the two-application structure, and the browser suite provided repeatable checks across real user-facing integration paths.

These are qualitative outcomes. No unverified performance, revenue, adoption, or reliability metric is attributed to my contribution.

## Source availability

Source code and screenshots are private. Architecture and implementation decisions are shared at a level appropriate for a professional team project. Repository links are intentionally omitted.

## What I would improve next

- Add explicit component and API-contract tests beneath the browser suite
- Make authorization-state tests a required part of each sensitive workflow
- Track bundle size and build-time budgets as part of CI
- Strengthen typed GraphQL generation to reduce drift between operations and UI models
- Add documented frontend telemetry conventions with privacy-safe event data
- Continue extracting shared code only where consumer and admin behavior is genuinely aligned
