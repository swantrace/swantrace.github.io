# Copilot Instructions for Portfolio Site

## Project Architecture

This is a **static portfolio site** built with:

- **HonoX**: Full-stack React framework using file-based routing in `app/routes/`
- **Bun**: Runtime and package manager
- **Vite SSG**: Static site generation with dual build modes (client/server)
- **Tailwind CSS v4**: Styling framework
- **Web Components**: Custom elements using haunted.js for interactive features

## Key Patterns

### Build System

- **Development**: `bun dev` runs content generation + Vite dev server concurrently
- **Production**: `bun run build:prod` → generates posts.json → builds client → builds SSG
- **Content Pipeline**: Markdown files in `content/` → `scripts/gen-posts.ts` → `public/posts.json`

### Routing Structure

- File-based routing in `app/routes/` (HonoX convention)
- Dynamic routes: `[slug].tsx` for blog posts
- `_renderer.tsx`: Global layout wrapper with conditional asset loading (dev vs prod)
- Route handlers use `createRoute()` and return `c.render()` with JSX

### Content Management

- **Posts**: Markdown files in `content/posts/` with frontmatter (title, date, tags, topic, draft, excerpt)
- **Projects**: Markdown files in `content/projects/`
- **Static Generation**: Build script parses markdown → generates `posts.json` for client-side access
- **Topic System**: Posts can belong to topics with ordering: `topic: [string, number]`

### Component Architecture

- **Server Components**: TSX files in `app/components/` (rendered server-side)
- **Web Components**: TS files in `app/wc/` using haunted.js (theme-switcher, copy-button, blog-list, html-demo, js-run)
- **Lazy Loading**: `app/client.ts` implements `lazyDefine()` for performance-optimized WC registration

### Asset Handling

- **CSS**: Single `app/style.css` with Tailwind
- **Build IDs**: `__BUILD_ID__` for cache busting in production
- **Base Path**: `VITE_BASE` environment variable for deployment flexibility

## Development Workflows

### Adding Blog Posts

1. Create `.md` file in `content/posts/` with frontmatter
2. Run `bun run gen:posts` (or automatic in dev mode)
3. Posts appear in blog listing and homepage

### Adding Components

- Server-rendered: Create `.tsx` in `app/components/`
- Interactive: Create `.ts` in `app/wc/` using haunted pattern, register in `app/client.ts`

### Interactive Code Blocks

- **HTML Demos**: Use ````html demo` in markdown to create interactive HTML previews via `<html-demo>` WC
- **JS Execution**: Use ````js run` to execute JavaScript at build time and display results via `<js-run>` WC
- **Plugins**: Located in `app/plugins/` with markdown-it integration, VM execution, and base64 encoding

### Styling Conventions

- Use Tailwind utility classes
- Dark mode: Classes auto-applied via theme-switcher WC
- Component-scoped styles: Inline with `class=` prop

## Critical Files

- `vite.config.ts`: Dual-mode build configuration (client/server)
- `scripts/gen-posts.ts`: Content processing pipeline
- `app/client.ts`: WC lazy loading system
- `app/utils/posts.ts`: Content parsing utilities
- `app/utils/markdown.ts`: Enhanced markdown processing with plugins
- `app/plugins/`: Markdown-it plugins for interactive code blocks
- `public/posts.json`: Generated content index

## Deployment

- GitHub Pages via `.github/workflows/deploy.yml` on main branch push
- SPA routing: `dist/404.html` copy for client-side routing
- Static assets in `dist/static/` with predictable filenames
