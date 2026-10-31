---
title: "x509-trust"
description: "A TypeScript certificate-validation library separating trusted policy configuration from untrusted certificate input, with CRL/OCSP checks and structured diagnostics."
tags: ["TypeScript", "Node.js", "X.509 / PKI", "CRL / OCSP", "Security"]
github: "https://github.com/swantrace/x509-trust"
links:
  - label: "npm package"
    href: "https://www.npmjs.com/package/x509-trust"
image: "/images/projects/x509-trust.svg"
imageAlt: "Abstract certificate chain anchored to a trust boundary, with separate revocation-evidence paths."
category: "Developer library"
status: "Published npm package"
role: "Library design and implementation"
featured: true
draft: false
sourceVisibility: public
order: 3
---

## At a glance

x509-trust is a TypeScript library for validating X.509 certificate chains and revocation evidence in Node.js. It grew from my work on a FHIR UDAP implementation, where certificate verification raised a broader application-design question: who selects the trust policy, and when?

Two communities can share a certificate authority while applying different rules. A valid certificate chain alone does not identify the intended community. The host application needs to select an approved trust context before validation begins.

The library is published on npm. The package page documents its current version, installation, and runtime requirements.

## The central design: configuration first, verification second

Applications register approved trust anchors and versioned validation profiles as trusted configuration. A verification request selects a locally registered profile and submits its certificate chain. It cannot supply replacement trust roots or redefine policy.

```text
Trusted application configuration
    │ approved anchors + versioned profiles
    ▼
Validation registry ← Untrusted certificate chain
    │
    ├── Certificate-path checks
    ├── CRL / OCSP evidence
    └── Profile rules
    ▼
Structured result and findings
```

The application remains responsible for mapping external community identifiers to approved local profiles. This keeps the trust decision explicit, even when different communities use overlapping roots.

## What I built

- Certificate-path validation against explicitly configured anchors, using existing PKI building blocks rather than custom cryptographic primitives.
- Immutable, versioned validation profiles and a registry that selects a stable configuration for each request.
- CRL and OCSP evidence checks with explicit requirements for usable, current revocation evidence.
- Concurrent evidence collection, bounded shared retrieval, per-origin limits, cancellation, and single-flight request coordination.
- Evidence caching with freshness limits and revalidation, plus structured results and diagnostic events.
- Extension boundaries for custom evidence loaders, cache stores, rules, and an optional worker-backed PKI engine.

## Key engineering decisions

### Unknown evidence must remain unknown

An unavailable, expired, or unusable revocation response cannot establish a good certificate status. Evidence requirements are configurable, but failure to obtain required evidence does not become successful validation. Structured findings help callers distinguish a bad path, revocation, and unresolved status.

### Bound work at the evidence-retrieval boundary

Certificate-advertised endpoints introduce network work outside the caller's direct control. Built-in retrieval applies destination restrictions, deadlines, and response-size limits. Shared retrieval coordinates concurrent requests; custom loaders take responsibility for their own transport restrictions.

### Cache evidence without bypassing validation

Caching reduces repeat retrieval, but creates a freshness trade-off. Evidence has bounded validity and is checked again in the relevant certificate and policy context. A cached response does not make future certificate-path checks unnecessary.

## Scope, validation, and next steps

The public repository documents installation, API behaviour, configuration, examples, and verification scenarios. It provides concrete boundaries that can be reviewed independently of a demonstration application.

The library does not implement UDAP discovery, OAuth endpoints, JWT claims, replay protection, or community membership rules. Those checks belong in the host application. Using x509-trust within the SSRAA implementation remains an integration direction rather than a completed production claim.

This work demonstrates my approach to security-oriented software design: make trust ownership explicit, keep failures inspectable, bound external work, and provide reusable interfaces without concealing the application's remaining responsibilities.
