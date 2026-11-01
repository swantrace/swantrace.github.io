---
title: "Building x509-trust: Certificate Chain and Revocation Validation in Node.js"
date: "2026-11-01"
tags: ["typescript", "nodejs", "x509", "security", "open-source"]
topic: null
draft: false
excerpt: "How I built a TypeScript library that combines trusted configuration, certificate-chain validation, CRL/OCSP evidence, and operational controls in Node.js."
---

When an application receives an X.509 certificate, checking its expiration date or verifying a signature is only part of establishing trust.

The application also needs to determine whether the certificate chains to a trusted authority, whether the certificates in that chain satisfy its validation requirements, and whether any of them have been revoked.

I encountered these challenges while working with Dr. Mohammad Jafari on implementing the HL7 FHIR UDAP Security Implementation Guide.

That work eventually led me to build [x509-trust](https://github.com/swantrace/x509-trust), an open-source TypeScript library for certificate-chain validation and comprehensive CRL/OCSP revocation checking in Node.js.

Although the initial motivation came from healthcare interoperability, I designed the library as a general-purpose component. It doesn't need to know anything about FHIR, UDAP, or OAuth.

## The Problem I Wanted to Solve

JavaScript already has libraries that can parse certificates, inspect extensions, verify signatures, and perform PKI operations.

PKIjs, for example, provides important building blocks for certificate processing and validation. x509-trust itself builds on PKIjs.

What I wanted was a higher-level API that brought several concerns together:

- A clearly defined set of application-approved trust anchors.
- Certificate-path validation.
- Configurable certificate and revocation requirements.
- CRL and OCSP response verification.
- Predictable handling of missing or inconclusive evidence.
- Structured results that explain why validation succeeded or failed.

These concerns are related, but each introduces its own failure modes.

I wanted an API that made the trust boundary clear and the common validation workflow straightforward.

## Start with Trusted Configuration

One of my central design decisions was to separate the certificates supplied for validation from the certificates an application actually trusts.

A certificate presented by an external party is evidence to evaluate. It should not automatically become a trusted root just because it appears in the supplied chain.

With x509-trust, the application creates a validator using its own approved trust anchors:

```typescript
import { createTrustValidator } from "x509-trust";

const validator = createTrustValidator({
  trustAnchors: [rootCertificate],
});

const result = await validator.verify({
  certificateChain: [
    leafCertificate,
    intermediateCertificate,
  ],
});

if (result.valid) {
  console.log(result.leafCertificate.fingerprint256);
} else {
  console.error(result.code, result.message);
}
```

Here, `rootCertificate` comes from the application's approved configuration, not from the external request.

The incoming chain contains the leaf certificate followed by its intermediates. The configured root establishes the trust boundary.

This separation is simple, but I think it's an important property to make obvious in a security-sensitive API.

## Revocation Checking Is More Than Downloading a Response

A certificate can be within its validity period and still be revoked.

Certificate Revocation Lists (CRLs) and the Online Certificate Status Protocol (OCSP) provide ways to obtain revocation information, but successfully retrieving a response isn't enough.

The response has to be usable as evidence.

For example, the validator needs to establish that the response is properly authenticated, corresponds to the certificate and issuer being checked, and satisfies freshness requirements.

I also wanted the results to distinguish between several situations that can otherwise be confused:

**Good:** Authenticated, current evidence establishes that a certificate is not revoked under the configured checks.

**Revoked:** Authenticated evidence establishes that the certificate has been revoked.

**Unknown or unavailable:** The validator cannot establish the required status from usable evidence.

That last case matters. A network failure, expired response, or mismatched issuer is not evidence that a certificate is good. But it also shouldn't be misreported as an authenticated revocation.

x509-trust rejects verification when required revocation evidence cannot be established.

## Making Revocation Requirements Configurable

Different applications may need different revocation-evidence policies.

The library supports configurations that require CRL evidence, OCSP evidence, either mechanism, or both mechanisms.

For example, an application can configure a validation profile that requires both:

```typescript
import {
  createTrustValidator,
  type ValidationProfileInput,
} from "x509-trust";

const profile: ValidationProfileInput = {
  id: "app:client-certificates",
  version: "2026-01",
  versionOrder: 1,
  source: "application configuration",
  anchorSetId: "app:approved-roots",
  revocation: {
    requiredEvidence: "both",
    sourceOrder: ["ocsp", "crl"],
  },
};

const validator = createTrustValidator({
  trustAnchors: [rootCertificate],
  profile,
});
```

Requiring both mechanisms is one policy choice, not a universal requirement for X.509 or UDAP.

The important part is that the requirement is explicit and controlled by the application.

Profiles can also express supported certificate requirements, including key usage, extended key usage, certificate policy OIDs, and path-depth limits.

## Supporting Multiple Validation Profiles

Some applications need more than one approved trust configuration.

Rather than allowing every incoming request to supply its own roots or validation rules, x509-trust provides a registry for profiles and their associated trust anchors.

```typescript
import {
  createValidationProfileRegistry,
} from "x509-trust";

const registry = createValidationProfileRegistry();

registry.register({
  profile,
  trustAnchors: [rootCertificate],
});

const result = await registry.verify({
  profileId: "app:client-certificates",
  certificateChain: [
    leafCertificate,
    intermediateCertificate,
  ],
});
```

Notice what the verification call doesn't accept: a new set of trust anchors.

The application must resolve `profileId` to an approved configuration. It should not blindly trust a profile identifier supplied by an external party.

This is where the library's responsibility ends and application policy begins.

The library validates certificates under a chosen configuration. It doesn't decide whether the caller is authorized to use that configuration.

## The Less Visible Challenge: Asynchronous Work

Revocation checking introduces network I/O, which creates a different set of engineering problems from certificate parsing.

Consider several validation requests arriving at roughly the same time. They may need identical CRL or OCSP data.

Downloading the same response independently for every caller is wasteful, so x509-trust supports sharing matching in-flight downloads.

But sharing introduces a cancellation problem.

If one caller no longer needs the result, it should be able to cancel its own verification. That cancellation must not terminate a shared download that another caller is still using.

Caching presents a similar challenge: cached revocation responses can reduce network work, but only while the responses remain eligible for use. A cache hit does not bypass evidence authentication or freshness requirements.

I implemented shared retrieval, cancellation handling, bounded execution, and caching with those constraints in mind.

The library also provides HTTP retrieval controls, including timeouts, response-size limits, origin restrictions, and protections against private-address retrieval by default.

These are important because certificate validation shouldn't turn into an unrestricted network-fetching mechanism.

## Making Failures Explainable

Security verification often produces a simple success-or-failure result.

For application developers, that may be sufficient to decide whether to accept a request. But when something fails, it helps to know why.

x509-trust returns structured failure codes and diagnostic findings.

For example, the application can distinguish an invalid certificate path from a revoked certificate, a revocation status that couldn't be established, or a profile rule that rejected the certificate.

Revocation findings can also describe the sources attempted and errors encountered.

I wanted callers to be able to use stable error categories for application decisions and detailed findings for troubleshooting, rather than parsing human-readable error messages.

## Testing the Unhappy Paths

Most of the difficult cases in certificate trust validation aren't successful validations.

They're cases where something is expired, missing, inconsistent, unavailable, or maliciously constructed.

The current x509-trust build passes 191 automated tests on Node.js 24.

The test suite covers certificate-path failures, untrusted roots, invalid signatures, expired certificates, CRL/OCSP response identity and freshness, contradictory revocation evidence, shared downloads, cancellation, cache failures, HTTP restrictions, and execution deadlines.

I also use OpenSSL-generated certificates and revocation fixtures, along with HTTP integration tests exercising the public API.

The optional worker-based execution path is tested against inline execution to check behavioral consistency.

These tests give me confidence in the covered scenarios. They aren't a substitute for independent security review, broader interoperability testing, or production experience.

## Why I Built on PKIjs

I wasn't trying to create another implementation of X.509 cryptography.

PKIjs already provides important certificate-processing and PKI functionality, and I use it for the underlying certificate-path validation work.

The contribution I wanted to make was at the application-facing layer: combining trusted configuration, profile selection, revocation-evidence requirements, operational controls, and structured verification results into a cohesive API.

I think choosing the correct boundary for a library is as important as deciding what features to add.

## Where the Project Stands

x509-trust is implemented as a standalone library, and its source code and usage documentation are available on GitHub.

My next planned step is to use it as the certificate-validation component in Sahara, an implementation of the HL7 FHIR UDAP Security IG.

That integration is not yet complete, and I haven't established the library as production-proven or independently audited.

I also don't want to limit the library to healthcare. The same separation between trusted configuration and untrusted certificate input could be valuable in other X.509-based applications.

## Final Thoughts

Building x509-trust reinforced something I've come to appreciate about security engineering.

The cryptographic operations matter, but so do the decisions surrounding them: where trust comes from, which evidence is sufficient, how concurrent operations are managed, and what an application does when verification cannot be completed.

Those questions shaped the library much more than any individual API call.

If you're working with X.509 certificates in Node.js, I'd be interested to hear how you handle certificate trust, revocation evidence, and operational failures.

**GitHub:** [https://github.com/swantrace/x509-trust](https://github.com/swantrace/x509-trust)

**Installation:** `npm install x509-trust`
