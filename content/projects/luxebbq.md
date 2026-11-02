---
title: "Luxe BBQ — Product Discovery & Catalogue Management"
description: "A custom Shopify storefront and catalogue-management application connecting advanced product discovery with practical tools for store staff."
tags: ["Shopify", "JavaScript", "Next.js", "GraphQL", "Web Components", "Liquid", "Node.js"]
github: "https://github.com/swantrace/luxebbq-theme"
links:
  - label: "Catalogue module source"
    href: "https://github.com/swantrace/luxebbq-custom-specific-module"
  - label: "Current client website"
    href: "https://luxebbq.ca/"
image: "/images/projects/luxebbq.svg"
imageAlt: "Abstract catalogue data flowing through a product-selection funnel into connected product groups."
category: "Client work"
status: "Historical implementation"
role: "Requirements, solution design, and full-stack development"
sourceNote: "Historical case study. The client used the custom solution for approximately two years before migrating to Shopify's native Search & Discovery. The current client website is a reference, not a live demonstration of my implementation."
featured: false
draft: false
sourceVisibility: public
order: 4
---

## At a glance

Luxe BBQ needed a better way for customers to discover and compare products across a large Shopify catalogue. Store staff also needed practical tools for maintaining the product information that made those experiences possible.

At the start of development, Shopify's native capabilities did not meet these particular filtering and discovery requirements. I worked directly with the client to understand the problem, evaluate existing applications, and deliver a custom storefront together with a product-attribute management module.

The two public repositories represent connected parts of one delivered solution.

## One problem, two connected experiences

A filtering interface is only useful when the underlying product information is consistent. Customers needed to narrow choices by relevant specifications; staff needed to maintain those specifications across thousands of products without editing every item by hand.

I connected these needs through Shopify's existing product data. The administration application managed structured attributes and generated the tags used by the storefront, giving both sides a shared source of product information.

```text
Store staff
    │ structured forms, bulk edits, CSV
    ▼
Custom product-attribute module
    │ product details and generated tags
    ▼
Shopify catalogue
    │
    ▼
Custom storefront → filtering, comparison, guided selection
```

## What I delivered

- Product filtering, comparison, and guided-selection experiences in the custom storefront.
- JavaScript, AJAX, and Web Component interactions that updated relevant results without a full page reload.
- Next.js and Node.js administration workflows for product details, tags, and metafields.
- Structured product-detail forms and automatic tag generation.
- Bulk editing and CSV import/export to reuse existing catalogue information and support ongoing maintenance.

## Key decisions

### Reuse the client's existing product information

The store had already invested in its Shopify catalogue and tags. Introducing a separate classification database would have added another synchronization and maintenance problem. The custom application worked with that existing information instead.

### Treat migration and daily maintenance as part of delivery

CSV workflows helped staff move existing data into the new structure and continue managing large updates. Bulk operations made the solution practical beyond its initial launch. This mattered as much as adding a customer-facing filter.

### Evaluate platform and third-party options before building

I researched existing Shopify applications before recommending a custom solution. The decision reflected the client's requirements and platform capabilities at that time. It was a contextual engineering choice rather than a permanent argument for custom development.

## Outcome and later platform evolution

The client used the custom solution for approximately two years. Shopify introduced relevant native capabilities during the project's development period, and the client later migrated to its native Search & Discovery solution.

That migration is part of the case study. The work delivered useful functionality when it was needed, while the platform subsequently offered a different maintenance path. I do not attribute the current website's filtering implementation to this work.

No historical application screenshots are included here. The cover is an original conceptual illustration, and the case study excludes the real customer administration environment. The repositories document the historical implementation; the client-site link points to the present-day business.
