// Curated from the supplied resume records; review notes and private evidence are omitted.
export const cv = {
  name: "Fred Hong",
  headline: "Senior full-stack engineer",
  summary:
    "I build web applications and integration tools, with experience across frontend systems, healthcare interoperability, and e-commerce. My work spans React interfaces, Node.js APIs, FHIR consent workflows, and Shopify integrations.",
  experiences: [
    {
      id: "shift",
      company: "Shift Health Care Task Force",
      role: "Lead Engineer",
      startDate: "2024-09",
      endDate: "2025-06",
      displayDates: "Sep 2024 - Jun 2025",
      context: "Contract · Part-time · Remote",
      summary:
        "Contributed across application development, integrations, and deployment for healthcare interoperability demonstrations connecting FHIR servers, privacy services, and EHR-facing applications.",
      primaryWork: [
        "Implemented interoperability workflows using Medplum, REST-hook FHIR Subscriptions, and SMART on FHIR.",
        "Extended a Medplum SMART application with interactive consent and security-labeling workflows, replacing terminal-oriented demonstrations with a user-facing application flow.",
        "Integrated consent-decision, security-labeling, and batch-processing services across multi-service FHIR demonstrations.",
        "Containerized and deployed partner-facing demonstration environments using Docker and Fly.io.",
      ],
    },
    {
      id: "asu",
      company: "Arizona State University",
      role: "Research Consultant",
      startDate: "2023-08",
      endDate: "2024-12",
      displayDates: "Aug 2023 - Dec 2024",
      context: "Contract · Part-time · Remote",
      summary:
        "Contributed to multidisciplinary research on FHIR-based digital consent, questionnaires, and clinical-research enrollment.",
      primaryWork: [
        "Developed React and Next.js interfaces for capturing and managing consent forms and questionnaire responses.",
        "Modeled reusable FHIR profiles, extensions, terminology, and value sets using FHIR Shorthand and SUSHI.",
        "Contributed data mapping, FHIR artifacts, and Implementation Guide generation, and co-authored two publications on pediatric and research-consent workflows.",
      ],
    },
    {
      id: "fluorescent",
      company: "Fluorescent Design Inc.",
      role: "Frontend Developer",
      startDate: "2023-01",
      endDate: "2023-07",
      displayDates: "Jan 2023 - Jul 2023",
      context: "Contract · Part-time · Remote · Vancouver, BC",
      summary:
        "Built Shopify embedded applications combining merchant-facing React interfaces with platform APIs and backend services.",
      primaryWork: [
        "Built application features using React, Shopify Polaris, App Bridge, and GraphQL.",
        "Connected frontend workflows to an Elixir/Phoenix backend, supported Docker-based development, and troubleshot integrations across application layers.",
        "Introduced a monorepo structure to make shared modules easier to reuse across application surfaces.",
      ],
    },
    {
      id: "midato",
      company: "Midato Health",
      role: "Full Stack Engineer",
      startDate: "2022-01",
      endDate: "2022-12",
      displayDates: "Jan 2022 - Dec 2022",
      context: "React · Redux · Node.js · GraphQL · AWS",
      summary:
        "Contributed full-stack features to a production, multi-tenant healthcare application supporting patient consent and administrative workflows in an AWS serverless environment.",
      primaryWork: [
        "Implemented selected GraphQL schemas and resolvers for validation, pagination, search, authorization, tenant isolation, and S3-backed document workflows.",
        "Strengthened automated testing with CodeceptJS and Playwright, including CI-specific timeout handling and trace capture for diagnosing failures.",
        "Led the Webpack-to-Vite migration, reducing GitHub Actions build time from 8 minutes to 2 minutes and improving the local development feedback loop.",
      ],
    },
    {
      id: "datomar",
      company: "Datomar Labs Venture Studio",
      role: "Full Stack Developer",
      startDate: "2020-07",
      endDate: "2021-12",
      displayDates: "Jul 2020 - Dec 2021",
      context: "Contract · Full-time · Remote · Winnipeg, MB",
      summary:
        "Helped build a custom Shopify commerce platform spanning an interactive storefront, administration tools, and catalogue management.",
      primaryWork: [
        "Developed product filtering, comparison, and guided-selection experiences using Web Components, GraphQL, and Shopify APIs.",
        "Built Next.js and Node.js administration tools with bulk CSV and metafield workflows, reducing repetitive catalogue maintenance time by an estimated 40% or more.",
        "Created reusable Shopify OAuth middleware with HMAC validation, state and nonce protection, session persistence, and authenticated API access.",
      ],
    },
    {
      id: "bold",
      company: "Bold Commerce",
      role: "Support Developer",
      startDate: "2017-07",
      endDate: "2020-06",
      displayDates: "Jul 2017 - Jun 2020",
      context: "Permanent · Full-time · On-site · Winnipeg metropolitan area",
      summary:
        "Diagnosed and resolved production integration issues across Shopify themes, merchant customizations, and installed applications.",
      primaryWork: [
        "Troubleshot JavaScript, Liquid, DOM lifecycle, and theme–app compatibility issues in live merchant storefronts.",
        "Built reusable integration scripts and a vanilla JavaScript helper using DOM events and MutationObserver for dynamically rendered storefront content.",
        "Documented reusable implementation patterns and improved troubleshooting practices, helping reduce resolution time for recurring issues by an estimated 30%.",
      ],
    },
  ],
  skillCategories: [
    {
      id: "languages-frontend",
      label: "Languages & Frontend",
      skills: [
        "JavaScript",
        "TypeScript",
        "HTML5",
        "CSS3",
        "React",
        "Next.js",
        "Redux / Redux Toolkit",
        "TanStack Query",
        "Tailwind CSS",
        "Web Components / Haunted",
      ],
    },
    {
      id: "backend-apis",
      label: "Backend & APIs",
      skills: [
        "Node.js",
        "Express",
        "Hono",
        "REST APIs",
        "GraphQL / Apollo",
        "BullMQ",
        "Idempotent Background Workflows",
        "Retry Handling",
      ],
    },
    {
      id: "databases",
      label: "Databases & Data",
      skills: [
        "SQL",
        "PostgreSQL",
        "PostgreSQL Query Optimization",
        "DynamoDB",
        "Redis",
        "Drizzle ORM",
      ],
    },
    {
      id: "cloud-tooling",
      label: "Cloud & Tooling",
      skills: [
        "AWS",
        "Amazon S3",
        "Docker",
        "Git",
        "GitHub Actions",
        "CI/CD",
        "Vite",
        "Monorepo Development",
        "pnpm Workspaces",
        "Turborepo",
      ],
    },
    {
      id: "testing-reliability",
      label: "Testing & Reliability",
      skills: [
        "Playwright",
        "Vitest",
        "React Testing Library",
        "Unit Testing",
        "Integration Testing",
        "Production Debugging and Troubleshooting",
      ],
    },
    {
      id: "security-integration",
      label: "Security & Integration",
      skills: ["OAuth 2.0", "Application Authorization", "Systems Integration"],
    },
    {
      id: "healthcare",
      label: "Healthcare Interoperability",
      skills: [
        "HL7 FHIR R4/R5",
        "SMART on FHIR",
        "FHIR Shorthand / SUSHI",
        "FHIR Subscriptions",
        "FHIR Security Labels",
        "Clinical Quality Language (CQL)",
        "CDS Hooks",
        "Healthcare Consent Systems",
      ],
    },
    {
      id: "commerce",
      label: "E-commerce",
      skills: [
        "Shopify Platform and APIs",
        "Shopify Liquid",
        "Shopify Polaris / App Bridge",
      ],
    },
    {
      id: "ai-applications",
      label: "AI Applications",
      skills: ["LLM Application Development", "Structured AI Outputs"],
    },
  ],
  publications: [
    {
      id: "pediatric-consent-on-fhir-2024",
      title: "Pediatric Consent on FHIR",
      year: 2024,
      kind: "Journal article",
      venue: "Applied Clinical Informatics",
      authors: [
        {
          name: "Voronov, A.",
          isCandidate: false,
        },
        {
          name: "Jafari, M.",
          isCandidate: false,
        },
        {
          name: "Zhao, L.",
          isCandidate: false,
        },
        {
          name: "Hong, Q.",
          isCandidate: true,
        },
      ],
      authorListIsTruncated: true,
      contributions: [
        "Data mapping",
        "FHIR Shorthand artifacts",
        "FHIR Implementation Guide generation",
      ],
      url: "https://www.researchgate.net/publication/379145083_Pediatric_Consent_on_FHIR",
    },
    {
      id: "informed-research-consent-framework-2024",
      title: "Informed Research Consent Framework and FHIR Validation",
      year: 2024,
      kind: "Research contribution",
      venue: null,
      authors: [
        {
          name: "Eluru, M.",
          isCandidate: false,
        },
        {
          name: "Hong, Q.",
          isCandidate: true,
        },
        {
          name: "Voronov, A.",
          isCandidate: false,
        },
        {
          name: "Jafari, M.",
          isCandidate: false,
        },
      ],
      authorListIsTruncated: true,
      contributions: [
        "Data mapping",
        "FHIR Shorthand artifacts",
        "FHIR Implementation Guide generation",
      ],
      url: "https://www.researchgate.net/publication/381723054_Informed_Research_Consent_Framework_and_Fhir_Validation",
    },
  ],
} as const;

export type CvExperience = (typeof cv.experiences)[number];
