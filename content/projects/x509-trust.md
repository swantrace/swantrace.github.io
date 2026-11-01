---
title: "x509-trust"
description: "A policy-driven TypeScript library for X.509 certificate-chain validation, CRL/OCSP revocation checking, and application-defined trust requirements."
tags: ["TypeScript", "Node.js", "PKIjs", "X.509 / PKI", "CRL / OCSP", "Security"]
github: "https://github.com/swantrace/x509-trust"
links:
  - label: "npm package"
    href: "https://www.npmjs.com/package/x509-trust"
image: "/images/projects/x509-trust.svg"
imageAlt: "Abstract certificate chain anchored to a trust boundary, with separate revocation-evidence paths."
category: "Developer library"
status: "Standalone library implemented and tested"
role: "Library design and implementation"
featured: true
draft: false
sourceVisibility: public
order: 3
---

_Building a Policy-Driven X.509 Trust Validation Library_

**TypeScript · Node.js · PKIjs · X.509 · CRL · OCSP · Security Engineering**

**GitHub:** [https://github.com/swantrace/x509-trust](https://github.com/swantrace/x509-trust)

**Status:** Standalone library implemented and tested. Integration with Sahara's FHIR UDAP implementation is planned.

## Overview

I built **x509-trust**, an open-source TypeScript library for validating X.509 certificate chains, checking certificate revocation, and applying application-defined trust policies.

The project grew out of my work with Dr. Mohammad Jafari on implementing the HL7 FHIR UDAP Security Implementation Guide. During that work, I encountered an architectural question: how should an application determine which trust policy to apply when more than one trust community may recognize the same certificate authority?

The question is specific to trust-policy selection, but it exposed a broader engineering need: a reusable certificate-validation component that keeps trust decisions under application control while handling the details of certificate-path validation and revocation checking.

I designed x509-trust to address that need independently of FHIR, UDAP, or OAuth.

## The Problem

Validating an X.509 certificate involves more than checking its signature and expiration date.

An application needs to establish a valid certification path to an approved trust anchor, enforce relevant certificate requirements, and determine whether certificates in the path have been revoked.

In applications supporting multiple trust contexts, it must also select the appropriate set of approved anchors and validation requirements.

Existing PKI libraries such as PKIjs provide valuable cryptographic and certificate-processing functionality. Rather than reimplementing those primitives, I wanted to build an application-facing layer that brought the necessary pieces together.

My primary design goal was to make the distinction between **trusted application configuration** and **untrusted certificate input** explicit.

## Architecture and Key Engineering Decisions

### 1. Separating Trust Configuration from Verification Requests

The application configures approved trust anchors and validation profiles ahead of time. A validation request supplies certificates and selects an existing profile; it cannot introduce new trust anchors.

I implemented a validation-profile registry to support multiple trusted configurations, including versioned profiles.

This keeps policy selection explicit and prevents the incoming certificate chain from redefining what the application considers trustworthy.

### 2. Treating Revocation as Evidence, Not a Boolean Lookup

Revocation checking is more complicated than retrieving a CRL or sending an OCSP request.

The response must be authenticated, correspond to the certificate and issuer being checked, and satisfy freshness requirements.

I designed the revocation layer to distinguish between an authenticated revoked result and a situation where valid evidence could not be established.

The library supports configurable CRL and OCSP requirements. If required evidence is unavailable or unusable, validation fails rather than treating an unknown status as good.

### 3. Coordinating Concurrent Validation Requests

Certificate validation can involve multiple network requests, and several callers may need the same revocation information.

I implemented shared revocation retrieval so matching requests can reuse an in-flight download. An individual caller can cancel its own operation without terminating work that other callers still need.

The library also supports caching, bounded request execution, deadlines, and HTTP retrieval restrictions.

These features help control redundant network activity while preserving validation correctness and resource limits.

### 4. Making Security Failures Explainable

A generic validation failure is not always sufficient when investigating certificate problems.

I designed structured verification results that distinguish failures such as invalid paths, revoked certificates, unknown revocation status, and rejected validation-profile requirements.

Diagnostic findings can include attempted revocation sources, error codes, and timing information.

This gives the calling application information it can use for logging, troubleshooting, and operational visibility.

## Implementation

The library is built with TypeScript for Node.js 24 and later, using PKIjs for underlying certificate-path validation and other PKI operations.

Its public API includes:

- `createTrustValidator()` for a validator configured with approved trust anchors.
- `createValidationProfileRegistry()` for managing multiple validation profiles and anchor sets.
- Configurable CRL/OCSP revocation requirements.
- Revocation retrieval, caching, and shared-download support.
- Optional worker-based PKI execution.
- Structured validation results and diagnostic findings.

The library deliberately does not implement UDAP discovery, dynamic client registration, OAuth authorization, or JWT claim validation. Those responsibilities remain with the host application.

## Testing and Validation

The current build succeeds on Node.js 24, with **191 passing automated tests**.

The test suite includes scenarios involving:

- Invalid certificate paths, signatures, untrusted roots, and expired certificates.
- CRL/OCSP response identity, authentication, and freshness checks.
- Revoked certificates and conflicting revocation evidence.
- Shared downloads, cancellation behavior, cache failures, and execution deadlines.
- HTTP retrieval limits and restrictions.
- Behavioral comparisons between inline and worker-based execution.

I also use OpenSSL-generated certificate and revocation fixtures, along with HTTP integration tests that exercise retrieval and caching through the public API.

These tests provide evidence for the behaviors and scenarios covered. The library has not yet been independently audited or established as production-proven.

## Trade-offs and Scope

One deliberate choice was to build on existing PKI capabilities instead of developing a certificate-path algorithm from scratch.

Another was to provide a reusable trust-validation component without embedding healthcare-specific concepts into its core API.

This makes x509-trust potentially useful beyond the project that motivated it, while keeping protocol-specific identity, membership, and authorization rules in the applications that own those decisions.

The current implementation also has documented limitations around supported revocation response forms and certificate-chain inputs. These are part of its explicit scope, rather than functionality I would claim it handles universally.

## Current Status and Next Steps

x509-trust is implemented as a standalone library.

My next intended step is to integrate it into **Sahara**, an implementation of the HL7 FHIR UDAP Security IG that already has discovery, registration, and trust-community configuration functionality.

That integration is not complete. Sahara currently uses its existing trust-store validation path.

Longer term, I want to explore the library's behavior in broader interoperability scenarios and evaluate it against additional real-world certificate and revocation infrastructures.

## What I Learned

The biggest lesson from this project is that security engineering is not only about performing cryptographic operations correctly.

It's also about defining **who controls trust configuration, which evidence is required, how failures are handled, and how the boundaries between components are enforced**.

Those decisions shaped both the library's API and its testing strategy.

**Explore the code:** [https://github.com/swantrace/x509-trust](https://github.com/swantrace/x509-trust)
