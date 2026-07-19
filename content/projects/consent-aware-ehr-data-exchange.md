---
title: "Consent-Aware EHR-to-EHR Data Exchange"
description: "A SMART on FHIR interoperability demonstration that retrieves patient-context data, applies privacy controls, and transfers the permitted resources to a second EHR."
tags: ["React", "TypeScript", "FHIR R4", "SMART on FHIR", "OAuth 2.0", "Medplum"]
github: "https://github.com/swantrace/medplum-shift"
featured: true
draft: false
sourceVisibility: public
order: 1
---

## At a glance

This project demonstrates a consent-aware path for moving FHIR R4 data between two EHR environments. A SMART application launches with patient context, retrieves that patient's clinical resources, passes them through security-labeling and consent-decision services, and writes the permitted resources to a target FHIR server.

This is an interoperability demonstration, not a production clinical system.

## Context and problem

Moving data between EHRs is not only a transport problem. The application needs to establish who launched it, preserve the selected patient context, retrieve a useful clinical data set, and apply privacy policy before anything reaches the receiving system.

The demonstration needed to make that sequence visible enough for a reviewer to follow while still exercising real FHIR and OAuth interactions.

## My role

I contributed to this professional contract project as a full-stack and interoperability engineer. My work focused on the SMART application and the integration workflow around Medplum. I did not build Medplum itself, and the surrounding security-labeling and clinical decision-support services are separate team systems.

## What I built

- A React and TypeScript SMART application that can launch from an EHR with patient context
- Source-patient data retrieval using the FHIR `Patient/$everything` operation
- A staged workflow that sends the retrieved bundle to a Security Labeling Service and then to a consent-aware CDS service
- OAuth-based connection to the target EHR
- Construction and submission of a FHIR transaction bundle containing the resources allowed by the demonstrated policy flow
- User-visible progress, resource counts, and failure states for each integration step
- Deployment scripts used to assemble the demonstration environment on Fly.io

## Architecture

```text
Source EHR
    │ SMART App Launch + patient context
    ▼
React / TypeScript SMART application
    │ Patient/$everything
    ▼
FHIR Bundle
    │
    ├──► Security Labeling Service
    │         │ labeled resources
    │         ▼
    └──► Consent-aware CDS service
              │ permitted resources
              ▼
        FHIR transaction bundle
              │ OAuth 2.0
              ▼
          Target EHR
```

The browser application acts as the workflow coordinator. It keeps each boundary explicit so the labeling result, consent decision, and final transfer can be inspected independently during a demonstration.

## Key decisions and trade-offs

### Use SMART launch context instead of asking for a patient ID

The patient is taken from the EHR launch context. This keeps the workflow aligned with SMART on FHIR and avoids introducing a separate patient-selection mechanism that could drift from the clinician's active context.

### Keep privacy processing as explicit stages

Labeling and consent evaluation are separate steps in the UI. That makes the data flow easier to explain and troubleshoot, but it also makes this a guided demonstration rather than a seamless background exchange.

### Transfer a transaction bundle

The target write is represented as a FHIR transaction bundle. This gives the receiving server one FHIR-native request boundary, while leaving resource identity, references, and server-side transaction behavior as concerns that need deeper hardening for production use.

## Reliability, testing, and observability

The interface reports loading, completion, and error state independently for source retrieval, labeling, consent evaluation, authentication, and target creation. It also summarizes resource counts so the demonstrated workflow can be checked at each boundary.

Validation for this version consists primarily of TypeScript/lint checks and repeatable end-to-end demonstration runs against configured FHIR environments. It should not be presented as having production-grade automated integration coverage.

## Security and privacy

- SMART launch and OAuth establish scoped access to the source and target systems.
- Privacy decisions occur before the final transaction is sent to the target.
- Configuration belongs in environment-specific settings; credentials and access tokens must not be committed.
- A production design should keep confidential client credentials and token exchange outside browser-delivered code, enforce least-privilege scopes, and add auditable server-side controls.

## Outcome

In the demonstrated workflow, a user can launch from a source EHR, retrieve the context patient's FHIR data, observe the labeling and consent-filtering stages, and create the permitted resources in a target EHR. This proves the integration path without claiming production readiness or clinical validation.

## Source availability

The project source is public. It includes work derived from and integrated with the open-source Medplum platform; the case study describes my application and integration contribution rather than ownership of Medplum.

## What I would improve next

- Move confidential OAuth operations behind a dedicated backend-for-frontend
- Add contract tests for the SLS and CDS service boundaries
- Add automated end-to-end tests for launch, filtering, partial failure, and retry paths
- Define identity/reference reconciliation rules for resources written to the target EHR
- Add structured audit events and correlation IDs across every service boundary
- Complete a documented threat model before treating the workflow as more than a demonstration
