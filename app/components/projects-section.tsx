import { url } from "../utils/url";
import { ProjectCard } from "./project-card";
import { SectionTitle } from "./section-title";

export const ProjectsSection = ({ projects }: { projects: ProjectMeta[] }) => {
  return (
    <section id="projects" className="mb-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>Featured Work</SectionTitle>
        <a
          className="link link-hover text-base-content/65 text-sm"
          href={url("/projects")}
        >
          View all projects →
        </a>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </section>
  );
};
