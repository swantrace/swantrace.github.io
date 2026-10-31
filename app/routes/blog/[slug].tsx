import { createRoute } from "honox/factory";
import { processMarkdown } from "../../utils/markdown";
import { getPostBySlug } from "../../utils/posts";
import { url } from "../../utils/url";

export default createRoute(async (c) => {
  const slug = c.req.param("slug");
  if (!slug) {
    return c.notFound();
  }

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
    <main className="blog-post">
      <title>{frontmatter.title} — Blog</title>
      <meta name="description" content={frontmatter.excerpt} />
      <div class="py-8">
        <nav className="mb-6">
          <a
            href={url("/")}
            className="link link-hover text-base-content/60 text-sm"
          >
            ← Back to Home
          </a>
        </nav>
        <article>
          <header class="mb-8">
            <h1 class="mb-5 text-3xl font-bold tracking-tight sm:text-4xl">
              {frontmatter.title}
            </h1>
            <div class="mb-4 flex flex-wrap gap-2">
              {frontmatter.date && (
                <time
                  class="text-base-content/60 text-sm"
                  dateTime={frontmatter.date}
                >
                  {new Date(frontmatter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {frontmatter.draft && (
                <span class="badge badge-warning badge-sm">Draft</span>
              )}
            </div>
            {frontmatter.tags.length > 0 && (
              <div class="flex flex-wrap gap-2">
                {frontmatter.tags.map((tag) => (
                  <a
                    href={url(`/blog?tag=${encodeURIComponent(tag)}`)}
                    class="badge badge-ghost badge-sm hover:underline"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            )}
          </header>
          <div
            class="blog-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          <footer class="border-base-300 mt-12 flex justify-between border-t pt-6">
            <a href={url("/blog")} class="link link-hover text-sm">
              ← Back to all posts
            </a>
          </footer>
        </article>
      </div>
    </main>
  );
});
