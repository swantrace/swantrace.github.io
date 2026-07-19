import { url } from "../utils/url";
import { ProjectCard } from "./project-card";
import { SectionTitle } from "./section-title";

export const ProjectsSection = ({ projects }: { projects: ProjectMeta[] }) => {
  return (
    <section id="projects" className="mt-16 mb-12 text-center md:text-left">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle>Featured Work</SectionTitle>
        <a className="link link-primary" href={url("/projects")}>
          View all projects →
        </a>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </div>
    </section>
  );
};
