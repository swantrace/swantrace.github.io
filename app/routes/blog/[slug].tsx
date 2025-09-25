import { createRoute } from "honox/factory";
import { getPostBySlug } from "../../utils/posts";
import { processMarkdown } from "../../utils/markdown";
import { url } from "../../utils/url";

export default createRoute(async (c) => {
  const slug = c.req.param("slug");
  const post = await getPostBySlug(slug);
  if (!post) {
    return c.notFound();
  }
  const { content, frontmatter } = post;
  const htmlContent = await processMarkdown(content);
  if (frontmatter.draft && import.meta.env.PROD) {
    return c.notFound();
  }
  return c.render(
    <>
      <title>{frontmatter.title} — Blog</title>
      <meta name="description" content={frontmatter.excerpt} />
      <div class="mx-auto max-w-3xl px-4 py-8">
        <nav className="mb-6">
          <a
            href="/"
            className="text-windsurfing hover:text-marina inline-flex items-center transition-colors"
          >
            ← Back to Home
          </a>
        </nav>
        <article>
          <header class="mb-8">
            <h1 class="mb-2 text-3xl font-bold">{frontmatter.title}</h1>
            <div class="mb-4 flex flex-wrap gap-2">
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
                <span class="rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                  Draft
                </span>
              )}
            </div>
            {frontmatter.tags.length > 0 && (
              <div class="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag) => (
                  <a
                    href={url(`/blog?tag=${encodeURIComponent(tag)}`)}
                    class="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 transition-colors hover:bg-blue-200"
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
          <footer class="mt-12 flex justify-between border-t border-gray-200 pt-6">
            <a
              href={url("/blog")}
              class="text-blue-600 transition-colors hover:text-blue-800"
            >
              ← Back to all posts
            </a>
          </footer>
        </article>
      </div>
    </>
  );
});
