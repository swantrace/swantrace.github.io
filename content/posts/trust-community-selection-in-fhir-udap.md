---
title: "Trust Community Selection in FHIR UDAP: Bridging the Gap Between Discovery and Registration"
date: "2026-11-01"
tags: ["fhir", "udap", "tefca", "x509", "security"]
topic: null
draft: false
excerpt: "An architectural proposal for preserving trust-community context between UDAP discovery and registration when communities share certificate authorities."
---

An architectural challenge I encountered while implementing the HL7 FHIR UDAP Security Implementation Guide

While working with Dr. Mohammad Jafari on implementing the HL7 FHIR UDAP Security Implementation Guide, I encountered a question that initially seemed to be about certificate validation but turned out to involve a broader architectural decision.

**How does an authorization server determine which trust community's validation policy to apply during Dynamic Client Registration?**

The UDAP IG defines a `community` parameter for discovery. It allows a client to request server metadata in the context of a particular trust community. But when the client later sends its signed software statement to the registration endpoint, there is no equivalent general-purpose `community` claim in the standard registration request.

This distinction becomes important when an authorization server supports multiple trust communities through a shared registration endpoint.

Imagine two communities that trust the same root Certificate Authority (CA) but enforce different validation policies. A client presents a certificate that chains successfully to that root. The server may establish a valid certification path, but that result alone doesn't necessarily tell it which community's policy the client intended to use.

The challenge isn't simply whether the certificate is trustworthy. It's determining **the intended trust context before validating the certificate under the appropriate policy**.

I've been exploring a design that preserves the community context selected during discovery in the registration endpoint returned to the client.

This article explains the problem, what the UDAP IG and TEFCA requirements establish, the alternatives I've considered, and how the design could work with [x509-trust](https://github.com/swantrace/x509-trust), the TypeScript certificate-validation library I've developed.

The proposed integration is not yet implemented in Sahara, and I consider the community-selection approach an architectural proposal rather than a requirement of the IG.

## 1. The Missing Context Between Discovery and Registration

UDAP provides a discovery mechanism through the authorization server's well-known metadata endpoint.

When a client wants to obtain metadata for a particular trust community, it can include the `community` parameter:

```http
GET /.well-known/udap?community=https%3A%2F%2Fcommunity-a.example.org
```

The parameter identifies a trust community whose certificates the client trusts.

The IG's primary motivation for this mechanism is that an authorization server may have different certificates associated with different trust communities. Because its signed metadata uses one signing certificate, the community parameter helps the server select a suitable certificate for the metadata response.

A server may also publish different capabilities for different communities.

There are version-specific requirements here. In UDAP Security IG 1.1.0, server support for the parameter is optional. In the published 2.0.0 version, servers are required to support it.

After discovering and validating the server's metadata, the client obtains the registration endpoint.

For example, the metadata might contain:

```json
{
  "registration_endpoint": "https://as.example.org/register"
}
```

The client subsequently submits a signed software statement to that URL:

```http
POST /register
Content-Type: application/json
{
  "software_statement": "<signed-software-statement-jwt>",
  "certifications": [],
  "udap": "1"
}
```

The software statement identifies the application through its `iss` claim and certificate information, and its `aud` claim identifies the authorization server's registration URL.

But the registration request does not have a standard, general-purpose field that explicitly carries forward the discovery `community` parameter.

This isn't necessarily a problem for every deployment.

If an authorization server serves only one trust community, or if its registration endpoints are already community-specific, it may know exactly which policy to use.

The ambiguity arises in a more specific situation:

- The authorization server supports multiple trust communities.
- Those communities use the same registration endpoint.
- Their trust anchors overlap.
- The incoming request provides no other reliable way to identify the intended community.

In that situation, the server needs an explicit strategy for selecting the correct validation context.

**The community context used during discovery isn't automatically preserved across a separate HTTP registration request.**

That is the architectural gap I'm interested in.

## 2. Why a Valid Certificate Chain May Not Identify the Community

Consider a hypothetical authorization server supporting two communities.

|                         | **Community A** | **Community B** |
| ----------------------- | --------------- | --------------- |
| Trusted Root CA         | Root X          | Root X          |
| Validation Profile      | Policy A        | Policy B        |
| Membership Requirements | Rules A         | Rules B         |
| Registration Endpoint   | `/register`     | `/register`     |

Both communities trust Root X, but their policies are different.

Suppose a client presents a certificate that chains successfully to Root X.

What can the authorization server conclude?

It may be able to establish a valid certification path under a particular configured set of requirements.

But the same root is approved by both communities. The chain alone doesn't necessarily establish which community the client intends to register under.

One policy might accept the certificate while the other rejects it. Both might accept it. Or additional membership rules might lead to different outcomes after certificate validation.

I find it useful to separate three decisions:

**Community selection:** Which approved trust context applies to the registration request?

**Certificate validation:** Does the presented certificate satisfy that context's approved trust anchors and certificate-validation requirements?

**Registration authorization:** Does the validated client satisfy the community's identity, certification, membership, and registration requirements?

These decisions are related, but they aren't interchangeable.

A successful certificate-path validation doesn't necessarily establish community membership. And selecting a community doesn't mean the client's certificate is automatically trusted.

This distinction becomes particularly important when different communities recognize the same CA.

## 3. What UDAP and TEFCA Actually Specify

Before proposing an implementation, I think it's important to separate the standards' requirements from application architecture.

The UDAP Security IG defines the discovery mechanism, registration workflow, software-statement requirements, certificate-related validation, and other security constraints.

It also recognizes that registrations in different trust-community contexts need to remain distinct when registrations are modified.

However, the published versions I've examined do not prescribe that a client must submit the discovery community identifier as a separate claim during registration, or that the server must copy it into the registration endpoint URL.

That leaves room for different deployment architectures.

### TEFCA as a Concrete Example

The TEFCA Facilitated FHIR Implementation SOP v2.0 adds requirements for participants using the HL7 SSRAA workflows in TEFCA Facilitated FHIR exchange.

Section 6.11 specifies a particular community URI for SSRAA metadata discovery:

```text
urn:oid:2.16.840.1.113883.3.7204.1.5
```

A request using that identifier can be represented as:

```http
GET /.well-known/udap?community=urn%3Aoid%3A2.16.840.1.113883.3.7204.1.5
```

The SOP also establishes additional requirements for TEFCA registrations.

For example, the metadata must identify the TEFCA Basic App Certification profile:

https://rce.sequoiaproject.org/udap/profiles/basic-app-certification

The SOP also requires certain certificate and software-statement properties, including an appropriate signing certificate and intermediate certificate in the JWT `x5c` header, and a client `iss` corresponding to a URI SAN in the client's certificate.

The applicable SAN URI path must contain the Exchange Purpose for which the client registers.

The TEFCA Basic App Certification JWT also includes information such as `exchange_purposes` and `home_community_id`.

These provide specific evidence and policy requirements that an authorization server must evaluate.

The `home_community_id` identifies the registering node's HomeCommunityId. It should not be confused with the `community` parameter identifying the trust community in UDAP discovery.

Likewise, a client presenting TEFCA-related credentials doesn't automatically establish that every TEFCA membership and authorization requirement has been met.

The TEFCA SOP references HL7 SSRAA 1.1.0. The continuous-build version of the HL7 IG may contain newer requirements, but those shouldn't automatically be treated as requirements of this TEFCA SOP.

For this discussion, TEFCA provides a useful example: the trust community has a defined identifier and additional registration policies, while the application must still ensure that those policies are applied in the correct context.

## 4. The Approaches I Considered

There are several ways an authorization server could determine the intended trust community.

I don't think one approach is necessarily appropriate for every deployment.

### A Server-Configured Default

If a registration endpoint supports only one community, the server can associate that endpoint with a fixed trust configuration.

This is straightforward and avoids the ambiguity entirely.

### Deriving the Community from the Certificate

An application could attempt to infer the community from the certificate or the trust anchor reached during validation.

That may work where trust anchors or certificate attributes map unambiguously to communities.

But it becomes less reliable when multiple communities share authorities or when a certificate could satisfy more than one policy.

Certificate extensions and application-maintained mappings may help, but they need clearly defined semantics and trustworthy configuration.

I wouldn't assume that a shared root CA uniquely identifies the community.

### Trying Every Community Profile

Another possibility is to attempt validation under every registered community profile and accept the first successful result.

I would be cautious about this approach.

If several profiles accept the certificate, the outcome may depend on evaluation order. It could also hide ambiguity about which community the client actually intended.

An application could define explicit handling for multiple successful profiles, but simply choosing the first one isn't a trust-policy selection rule I'd want to rely on.

### Separate Registration Paths or Hostnames

A server could expose different registration endpoints:

```text
https://as.example.org/community-a/register
https://as.example.org/community-b/register
```

This makes community context part of the endpoint's server-controlled configuration.

It's a reasonable design and may be preferable in some deployments.

### Preserving the Community in the Discovered Registration URL

The approach I've been exploring is to keep a shared registration handler while returning a community-specific registration URL during discovery.

For example:

```text
https://as.example.org/register?community=https%3A%2F%2Fcommunity-a.example.org
```

This allows the client to use the endpoint discovered from the server without having to construct an additional parameter itself.

The server can then resolve that URL's community identifier against its approved trust configuration.

This is the option I want to examine more closely.

## 5. My Proposed Design: Carry Community Context into Registration

Suppose a client requests metadata for Community A:

```http
GET /.well-known/udap?community=https%3A%2F%2Fcommunity-a.example.org
```

The authorization server recognizes the community and returns metadata containing:

```json
{
  "registration_endpoint": "https://as.example.org/register?community=https%3A%2F%2Fcommunity-a.example.org"
}
```

The client uses this registration endpoint when constructing and submitting its software statement.

From the client's perspective, it follows the endpoint supplied by the authorization server.

From the server's perspective, the registration URL provides an explicit community-selection input.

However, that input is still untrusted.

A client could construct the URL independently, so merely receiving the community parameter doesn't prove that the client performed discovery or belongs to that community.

The server must validate the identifier against its own supported and approved configurations.

The URL selects the requested context; it doesn't supply the trust configuration or prove eligibility to register.

### Two Separate Phases: Trusted Configuration and Request-Time Verification

This distinction is central to the architecture.

**Phase 1: Trusted Configuration**

Before processing client registration requests, the application loads the trust communities it supports, along with their approved trust anchors and versioned certificate-validation profiles.

These configurations come from trusted application or administrative sources.

They may be established at startup or updated through a controlled configuration-management process.

The application registers them with x509-trust using `registry.register()`.

For example:

```typescript
import {
  createValidationProfileRegistry,
} from "x509-trust";

const registry = createValidationProfileRegistry();

registry.register({
  profile: communityAProfile,
  trustAnchors: communityAApprovedAnchors,
});

registry.register({
  profile: tefcaProfile,
  trustAnchors: tefcaApprovedAnchors,
});
```

These profiles represent application-approved configurations.

They are not created from a client's certificate chain, JWT claims, or arbitrary request parameters.

**Phase 2: Request-Time Profile Selection and Verification**

Later, when a Dynamic Client Registration request arrives, the application resolves its community context to an already approved profile.

For example, the host application might maintain a mapping conceptually equivalent to:

```typescript
const communityProfiles = new Map([
  [
    "https://community-a.example.org",
    communityAProfile.id,
  ],
  [
    "urn:oid:2.16.840.1.113883.3.7204.1.5",
    tefcaProfile.id,
  ],
]);
```

After the application has parsed and validated the requested community identifier against its approved mapping, it can select the profile:

```typescript
const profileId = communityProfiles.get(
  requestedCommunity
);

if (!profileId) {
  throw new Error("Unsupported trust community");
}
```

The application can then call the library:

```typescript
const result = await registry.verify({
  profileId,
  certificateChain: x5cCertificates,
});
```

The registry verifies the certificates under the selected profile.

The incoming request doesn't create a profile and cannot replace the configured trust anchors.

**What happens dynamically is the selection of an existing trusted profile—not the creation of a new trust policy from client input.**

This separation makes the application/library boundary explicit.

The application owns the community mapping and decides which trust policy applies. The library carries out certificate validation under that approved policy.

### Why Not Register a Profile During Every Request?

The registry API can be used during runtime, but that doesn't mean the application should register trust policies based on untrusted requests.

For example, allowing a registration request to supply both its own profile and trusted roots would let the client influence what the server considers trustworthy.

That would undermine the trust boundary.

Runtime configuration updates can still be appropriate when they come from trusted administrative sources.

But they are logically separate from verifying a registering client's certificate.

## 6. The Software Statement Audience Must Match the Selected Endpoint

One important consequence of the proposed URL design involves the software statement's `aud` claim.

In UDAP Dynamic Client Registration, the audience identifies the authorization server's registration URL.

If discovery returns:

```text
https://as.example.org/register?community=https%3A%2F%2Fcommunity-a.example.org
```

then the application needs to validate `aud` consistently with that published registration endpoint, including the relevant query component.

It shouldn't select a community using the query parameter and then casually discard that component when validating the expected audience.

I would prefer the application to select the expected audience from its approved endpoint configuration instead of constructing the expected value from arbitrary client-provided input.

This raises several interoperability questions.

How do clients preserve URL encoding when constructing their software statements?

How should the server handle reordered or duplicated query parameters?

Are different URI representations considered equivalent under the applicable audience-validation rules?

Would existing UDAP clients accept and use community-specific registration endpoints that contain query strings?

These questions need testing and further review before treating this URL format as a settled design.

The query parameter also isn't a cryptographic proof that discovery took place. It is an explicit selection of a server-approved context, and the software statement and all associated registration requirements still have to be validated.

## 7. Where x509-trust Fits

The architecture described above influenced the design of [x509-trust](https://github.com/swantrace/x509-trust), my TypeScript library for X.509 certificate-chain and revocation validation.

I wanted the API to reinforce the separation between trusted configuration and untrusted certificate input.

An application can register versioned validation profiles and their approved anchors:

```typescript
import {
  createValidationProfileRegistry,
} from "x509-trust";

const registry = createValidationProfileRegistry();

registry.register({
  trustAnchors: approvedAnchors,
  profile: {
    id: "https://community-a.example.org",
    version: "2026-01",
    versionOrder: 1,
    source: {
      uri: "https://community-a.example.org/policy",
    },
    anchorSetId: "community-a:roots:2026-01",
    revocation: {
      requiredEvidence: "both",
      sourceOrder: ["crl", "ocsp"],
    },
  },
});
```

The `approvedAnchors` value must come from trusted application configuration.

The example revocation requirements are illustrative. Requiring both CRL and OCSP evidence is a configurable policy choice, not a universal UDAP or TEFCA requirement.

When an incoming registration request arrives, the host application identifies the approved profile to use and passes its identifier and the presented certificates to the registry:

```typescript
const result = await registry.verify({
  profileId,
  certificateChain: x5cCertificates,
});
```

Notice that `verify()` doesn't accept new trust anchors.

The certificates being verified are untrusted input. The approved roots and validation rules were already established.

The library uses PKIjs for underlying certificate-path validation and supports configured CRL/OCSP revocation checks. Its structured results help distinguish invalid paths, revoked certificates, unknown revocation status, and other validation failures.

It deliberately does not decide which community the client belongs to, perform UDAP discovery, validate software-statement JWT claims, or authorize registration.

Those remain responsibilities of Sahara or another host application.

The distinction matters because selecting a valid certificate profile is necessary for trust validation, but it isn't the entire registration decision.

## 8. Registration Identity Across Communities

There is another consequence of community-specific registration: identity management.

Suppose an application uses the same `iss` URI to register under Community A and Community B.

If the server identifies registrations using only `iss`, a later registration modification could potentially affect the wrong registration.

The UDAP IG recognizes the need to keep registrations in different trust-community contexts separate.

One application-level identity model I've considered is:

```text
(community, iss)
```

This would allow the server to distinguish the same client URI across different community contexts.

However, it is a logical model, not a database schema mandated by the IG.

The implementation would still need to follow the applicable registration modification requirements, `client_id` lifecycle rules, and any community-specific constraints.

For TEFCA, Exchange Purpose requirements also matter. The SOP requires separate client applications for initiating nodes operating under multiple Exchange Purposes.

Therefore, `(community, iss)` should be treated as one possible part of the registration identity design, not a complete universal identity key.

I think this area deserves further review because preserving community context should extend beyond the initial validation step when registration semantics require it.

## 9. Open Questions and Trade-offs

The approach I've outlined is still a design under consideration.

Several questions remain.

**Is a query parameter the best place to carry community context?** Separate paths or hostnames might make the distinction clearer, especially if they integrate better with existing UDAP clients.

**How should audience validation work across URL representations?** This needs precise handling to prevent disagreement between the endpoint used for routing and the endpoint identified by the signed software statement.

**How should the server behave when the community identifier is missing or invalid?** A safe default might be rejection for a multi-community endpoint, but the behavior should be defined explicitly rather than depend on implementation accidents.

**How should the application handle certificates that satisfy multiple profiles?** The selected community should determine the intended validation context, while additional community membership and registration rules remain independent checks.

**How should registration modifications preserve community identity?** The storage and client-identity model needs to account for the IG's registration semantics and requirements imposed by frameworks such as TEFCA.

**How interoperable is the design?** I'd like to test how existing UDAP clients handle query-bearing registration endpoints and whether the approach introduces unexpected behavior.

These questions are why I see the current proposal as a starting point for architectural discussion rather than a final implementation recommendation.

## 10. Where This Goes Next

The x509-trust library is implemented and tested as a standalone Node.js component.

My intention is to integrate it into Sahara, an implementation of the HL7 FHIR UDAP Security IG that already contains discovery, registration, and trust-community configuration functionality.

That integration is still planned. Sahara currently uses its existing trust-store validation path.

The community-selection and registration URL design described here is also not yet a completed end-to-end implementation.

I want to investigate the proposal further, particularly its interaction with software-statement audience validation, community membership policies, and real-world UDAP client behavior.

One reason I kept UDAP-specific concepts out of the library's core API is that the boundary between approved trust configuration and untrusted certificate input may be useful well beyond healthcare interoperability.

The library can enforce certificate-validation requirements under a selected profile without needing to know how a particular application selected that profile.

## Final Thoughts

The question that started this work was how to validate a client's certificate in a multi-community environment.

But the deeper problem is how an authorization server determines the correct context in which that validation should happen.

UDAP discovery provides a way for clients to identify a trust community when requesting server metadata. During registration, however, a shared authorization server still needs a reliable way to preserve or resolve the intended community.

A valid certificate chain may not provide that answer when communities share trust anchors.

My proposed approach is to preserve the community context in the registration endpoint returned during discovery, then resolve it against trusted application configuration when the registration request arrives.

The corresponding library design separates trust configuration from request-time verification: approved profiles and anchors are registered independently of incoming requests, and each request selects an existing profile rather than creating a new source of trust.

This doesn't eliminate the need for JWT verification, community membership checks, certification requirements, or registration authorization.

It makes the responsibilities explicit.

**The application decides which trust context is relevant. The library verifies the certificate against that context. The authorization server makes the final registration decision.**

That's the architectural boundary I've been working toward, and I'm interested in how other UDAP implementers approach the same problem.

In particular, how do you handle trust-community selection when multiple communities share both certificate authorities and registration infrastructure?

## References

- [HL7 UDAP Security IG 1.1.0 — Discovery](https://hl7.org/fhir/us/udap-security/STU1.1/discovery.html)
- [HL7 UDAP Security IG 1.1.0 — Registration](https://hl7.org/fhir/us/udap-security/STU1.1/registration.html)
- [HL7 UDAP Security IG 2.0.0](https://hl7.org/fhir/us/udap-security/)
- [HL7 UDAP Security IG Continuous Build](https://build.fhir.org/ig/HL7/fhir-udap-security-ig/)
- TEFCA Facilitated FHIR Implementation SOP v2.0 — Sections 6.1, 6.2, and 6.11
- [x509-trust on GitHub](https://github.com/swantrace/x509-trust)
