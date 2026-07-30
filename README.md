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

## Custom content elements

The client registers `copy-button`, `html-demo`, and `js-run` as progressively enhanced custom elements. They are lazy-loaded when first encountered and scheduled for idle preloading to reduce interaction delay. They can be used in posts or project case studies.

### `copy-button`

Use `copy-button` when a reader should be able to copy a short, fixed value. Set the text to copy with the `text` attribute:

```html
<copy-button text="bun run dev"></copy-button>
```

Raw HTML is enabled in the Markdown renderer, so the same markup works directly in a Markdown file. Escape characters such as `&`, `<`, and quotes when they appear inside the attribute. The button uses the browser Clipboard API and briefly changes its label to `Copied!` after a successful copy.

Clipboard access requires a secure browser context, such as HTTPS or localhost.

### `html-demo`

The recommended way to create an `html-demo` is an HTML or XML code fence with the `demo` flag:

````markdown
```html demo
<style>
  .example-card {
    border: 1px solid light-dark(#bae6fd, #075985);
    border-radius: 0.5rem;
    background: light-dark(#e0f2fe, #082f49);
    color: light-dark(#082f49, #e0f2fe);
    padding: 1rem;
  }
</style>
<section class="example-card">
  <h2>Interactive preview</h2>
  <button type="button">Example button</button>
</section>
```
````

`xml demo` and the brace form `html {demo}` are also supported. During Markdown rendering, the plugin:

1. Syntax-highlights the source.
2. Encodes the source and highlighted markup into an `html-demo` element.
3. Displays the rendered preview.
4. Provides **Show Code**, **Hide Code**, and **Copy** controls.

The generated element has this internal shape:

```html
<html-demo src="base64url-source" code="base64url-highlighted-source" badge="html"></html-demo>
```

Authors should normally use the fenced-code syntax instead of building these
Base64URL attributes manually.

`html-demo` uses Shadow DOM. The preview is placed in its own nested shadow
root so styles written for an example cannot change the demo toolbar. The
preview is declarative only: scripts, embedded documents, inline event
handlers, and executable URLs are removed, and form submissions are prevented.
Native form validation still works.

Because global styles do not cross a shadow boundary, Tailwind utility classes
from the main page do not style elements inside the preview. Include a local
`<style>` block when a demo needs custom CSS, as in the example above. Those
styles remain isolated to that preview.

The component exposes these CSS shadow parts: `frame`, `toolbar`, `badge`,
`actions`, `control`, `copy-button`, `toggle-button`, `preview`, `code`, and
`code-content`.

They can be styled from Tailwind's component layer with `::part()`:

```css
@layer components {
  html-demo::part(frame) {
    @apply rounded-xl shadow-sm;
  }

  html-demo::part(control) {
    @apply rounded-md;
  }
}
```

### `js-run`

Use a JavaScript code fence with the `run` flag to execute a self-contained example during the static build:

````markdown
```js run
const values = [2, 4, 6];
console.log("values", values);
return values.reduce((total, value) => total + value, 0);
```
````

`javascript run` and `javascript {run}` are also supported. The generated page displays:

- Syntax-highlighted source with line numbers
- Captured `console.log`, `console.info`, `console.warn`, and `console.error` output
- The returned value, when the snippet explicitly returns one
- A build-time error, when execution fails
- A button for copying the original source

JavaScript runs during Markdown processing in a Node.js VM—not in the reader's browser. The current configuration has a two-second timeout and does not expose `require`. Top-level `await` is supported, but examples should remain deterministic, self-contained, and free of network, filesystem, secret, or environment dependencies.

The Markdown preprocessor converts the fence into a `js-run` element with Base64URL-encoded source, highlighted code, logs, return value, and error attributes. Those attributes are an internal rendering format; content authors should use the fenced-code form.

## Deployment

Pushes to `main` run the GitHub Actions workflow in `.github/workflows/deploy.yml`. The workflow installs dependencies, runs Biome and TypeScript checks, creates the static production build, and deploys `dist/` to GitHub Pages.

The production site URL is configured through `VITE_SITE_URL` in the deployment workflow.
