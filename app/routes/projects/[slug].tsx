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
      <div className="py-8">
        <nav className="mb-8">
          <a
            className="link link-hover text-base-content/60 text-sm"
            href={url("/projects")}
          >
            ← All projects
          </a>
        </nav>

        <article>
          <header className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {frontmatter.title}
            </h1>
            <p className="text-base-content/70 mt-4 text-xl leading-relaxed">
              {frontmatter.description}
            </p>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 text-sm">
              {[
                ["Type", frontmatter.category],
                ["Status", frontmatter.status],
                ["My role", frontmatter.role],
              ].map(([label, value]) =>
                value ? (
                  <div key={label}>
                    <dt className="text-base-content/65 mb-1 text-xs">
                      {label}
                    </dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ) : null
              )}
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="badge badge-ghost badge-sm">
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
                  Visit app ↗
                </a>
              )}
              {frontmatter.links.map((link) => (
                <a
                  key={link.href}
                  className="btn btn-outline btn-sm"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>

            {frontmatter.demoNote && (
              <p className="text-base-content/65 mt-4 text-sm leading-relaxed">
                {frontmatter.demoNote}
              </p>
            )}
            {frontmatter.sourceNote && (
              <p className="text-base-content/65 border-base-300 mt-6 border-l-2 pl-4 text-sm leading-relaxed">
                {frontmatter.sourceNote}
              </p>
            )}
          </header>

          {imageUrl && (
            <figure className="mb-10">
              <img
                src={imageUrl}
                alt={
                  frontmatter.imageAlt ||
                  `Technical illustration for ${frontmatter.title}`
                }
                width={960}
                height={600}
                className="h-auto w-full rounded-xl"
              />
              <figcaption className="text-base-content/65 mt-3 text-xs">
                Conceptual technical illustration
              </figcaption>
            </figure>
          )}

          <div
            className="blog-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>
    </main>
  );
});
