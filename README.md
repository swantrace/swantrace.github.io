# Fred Hong's Portfolio

A statically generated portfolio and technical writing site for presenting Fred Hong's full-stack, frontend, and healthcare interoperability work.

The site is designed to give hiring teams more than a list of technologies. It combines project case studies with long-form technical articles so that each project can explain the problem, implementation decisions, trade-offs, and results behind the work.

## What the site includes

- A focused home page with featured work, recent writing, skills, and contact links
- Markdown-powered project case studies at `/projects/[slug]`
- A technical blog with tags, drafts, syntax highlighting, KaTeX, and interactive examples
- Static-site generation suitable for GitHub Pages
- Draft filtering so unfinished posts and projects are not included in production output
- Generated post metadata and sitemap files
- Progressive enhancement through small Web Components
- Responsive styling with light and dark themes

## Tech stack

| Area | Technology |
| --- | --- |
| Application framework | [HonoX](https://github.com/honojs/honox) and [Hono](https://hono.dev/) |
| Language | TypeScript and TSX |
| Runtime and package manager | [Bun](https://bun.sh/) |
| Build and static generation | [Vite](https://vite.dev/) and `@hono/vite-ssg` |
| Styling | [Tailwind CSS](https://tailwindcss.com/), daisyUI, and Tailwind Typography |
| Content | Markdown, gray-matter, and markdown-it |
| Technical writing | highlight.js, KaTeX, and custom Markdown plugins |
| Browser interactivity | Web Components, Haunted, and lit-html |
| Code quality | Biome and TypeScript |
| Hosting and CI/CD | GitHub Pages and GitHub Actions |

## Project structure

```text
app/
  components/          Reusable UI components
  markdown-plugins/    Custom Markdown rendering features
  routes/              HonoX pages and static routes
  utils/               Content loading and URL helpers
  wc/                  Progressively enhanced Web Components
content/
  posts/               Technical articles in Markdown
  projects/            Project case studies in Markdown
public/                 Static assets and generated metadata
scripts/                Post index and sitemap generators
```

## Getting started

### Requirements

- [Bun](https://bun.sh/) installed locally

### Install and run

```bash
bun install
bun run dev
```

The development server watches the post directory and regenerates `public/posts.json` when content changes.

## Available commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server and content watcher |
| `bun run build:local` | Generate content metadata and create a local production build |
| `bun run build:prod` | Generate the GitHub Pages production build |
| `bun run preview` | Preview the generated site |
| `bun run check` | Run Biome formatting and lint checks |
| `bun run check:fix` | Apply safe Biome formatting and lint fixes |
| `bun run typecheck` | Run TypeScript without emitting files |
| `bun run gen:posts` | Regenerate the published post index |
| `bun run gen:sitemap` | Regenerate the sitemap |

## Writing content

Posts and projects use Markdown with YAML frontmatter. Set `draft: true` while content is incomplete; drafts are excluded from production listings, static detail pages, and the sitemap.

A project can be marked as featured and can describe whether its source is public or private:

```yaml
---
title: Consent-Aware EHR-to-EHR Data Exchange
description: A case study in consent-aware healthcare interoperability.
tags:
  - FHIR
  - OAuth
  - TypeScript
featured: true
draft: true
sourceVisibility: private
sourceNote: Source code is private. Architecture and implementation decisions are shared with permission.
order: 1
---
```

Project Markdown is rendered as the body of its case-study page. The home page displays only published projects with `featured: true`, while `/projects` lists all published projects.

## Deployment

Pushes to `main` run the GitHub Actions workflow in `.github/workflows/deploy.yml`. The workflow installs dependencies, runs Biome and TypeScript checks, creates the static production build, and deploys `dist/` to GitHub Pages.

The production site URL is configured through `VITE_SITE_URL` in the deployment workflow.
