import { createRoute } from "honox/factory";
import { ProjectCard } from "../../components/project-card";
import { getAllProjects } from "../../utils/projects";
import { url } from "../../utils/url";

export default createRoute(async (c) => {
  const projects = await getAllProjects();

  return c.render(
    <main>
      <title>Projects — Fred Hong</title>
      <meta
        name="description"
        content="Full-stack, frontend, and FHIR interoperability case studies by Fred Hong."
      />
      <div className="mx-auto max-w-6xl py-8">
        <nav className="mb-8">
          <a className="link link-primary" href={url("/")}>
            ← Back to home
          </a>
        </nav>

        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-bold">Projects</h1>
          <p className="text-base-content/70 mt-4 text-lg">
            Case studies covering full-stack engineering, frontend systems, and
            healthcare interoperability.
          </p>
        </header>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} {...project} />
            ))}
          </div>
        ) : (
          <div className="alert">
            <span>Project case studies are being prepared.</span>
          </div>
        )}
      </div>
    </main>
  );
});
