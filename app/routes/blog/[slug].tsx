import { createRequire } from "node:module";
import { createRoute } from "honox/factory";
import MarkdownIt from "markdown-it";
import { getPostBySlug } from "../../utils/posts";
import { url } from "../../utils/url";

const require = createRequire(import.meta.url);
const hljs = require("highlight.js");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return "";
  },
});

export default createRoute(async (c) => {
  const slug = c.req.param("slug");
  const post = await getPostBySlug(slug);
  if (!post) {
    return c.notFound();
  }
  const { content, frontmatter } = post;
  const htmlContent = md.render(content);
  if (frontmatter.draft && import.meta.env.PROD) {
    return c.notFound();
  }
  return c.render(
    <>
      <title>{frontmatter.title} — Blog</title>
      <meta name="description" content={frontmatter.excerpt} />
      <div class="max-w-3xl mx-auto px-4 py-8">
        <nav className="mb-6">
          <a
            href="/"
            className="inline-flex items-center text-windsurfing hover:text-marina transition-colors"
          >
            ← Back to Home
          </a>
        </nav>
        <article>
          <header class="mb-8">
            <h1 class="text-3xl font-bold mb-2">{frontmatter.title}</h1>
            <div class="flex flex-wrap gap-2 mb-4">
              {frontmatter.date && (
                <time class="text-gray-500" dateTime={frontmatter.date}>
                  {new Date(frontmatter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {frontmatter.draft && (
                <span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Draft
                </span>
              )}
            </div>
            {frontmatter.tags.length > 0 && (
              <div class="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag) => (
                  <a
                    href={url(`/blog?tag=${encodeURIComponent(tag)}`)}
                    class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded hover:bg-blue-200 transition-colors"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            )}
          </header>
          <div
            class="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          <footer class="mt-12 pt-6 border-t border-gray-200 flex justify-between">
            <a
              href={url("/blog")}
              class="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Back to all posts
            </a>
          </footer>
        </article>
      </div>
    </>
  );
});
