import { createRoute } from "honox/factory";
import { processMarkdown } from "../../utils/markdown";
import { getProjectBySlug } from "../../utils/projects";
import { url } from "../../utils/url";

export default createRoute(async (c) => {
  const slug = c.req.param("slug");
  if (!slug) {
    return c.notFound();
  }

  const project = await getProjectBySlug(slug);
  if (!project || (project.frontmatter.draft && import.meta.env.PROD)) {
    return c.notFound();
  }

  const { content, frontmatter } = project;
  const htmlContent = await processMarkdown(content);
  const imageUrl = frontmatter.image
    ? /^(https?:)?\/\//.test(frontmatter.image) ||
      frontmatter.image.startsWith("data:")
      ? frontmatter.image
      : url(frontmatter.image)
    : null;

  return c.render(
    <main>
      <title>{frontmatter.title} — Project</title>
      <meta name="description" content={frontmatter.description} />
      <div className="mx-auto max-w-4xl py-8">
        <nav className="mb-8">
          <a className="link link-primary" href={url("/projects")}>
            ← All projects
          </a>
        </nav>

        <article>
          <header className="mb-10">
            <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
            <p className="text-base-content/70 mt-4 text-xl leading-relaxed">
              {frontmatter.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="badge badge-secondary">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {frontmatter.github && (
                <a
                  className="btn btn-outline btn-sm"
                  href={frontmatter.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  View source
                </a>
              )}
              {frontmatter.demo && (
                <a
                  className="btn btn-primary btn-sm"
                  href={frontmatter.demo}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open live demo
                </a>
              )}
            </div>

            {frontmatter.sourceVisibility === "private" && (
              <div className="alert mt-6">
                <span>
                  {frontmatter.sourceNote ||
                    "Source code is private. Architecture and implementation decisions are shared with permission."}
                </span>
              </div>
            )}
          </header>

          {imageUrl && (
            <figure className="mb-10 overflow-hidden rounded-xl shadow-lg">
              <img
                src={imageUrl}
                alt={`Screenshot of ${frontmatter.title}`}
                className="h-auto w-full"
              />
            </figure>
          )}

          <div
            className="blog-content prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>
    </main>
  );
});
