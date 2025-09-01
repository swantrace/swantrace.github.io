import { SectionTitle } from "./section-title";
import { ProjectCard } from "./project-card";

export const ProjectsSection = ({ projects }: { projects: ProjectMeta[] }) => {
  return (
    <section id="projects" className="mt-16 mb-12 text-center md:text-left">
      <SectionTitle>Projects</SectionTitle>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            description={project.description}
            tags={project.tags}
            github={project.github}
            demo={project.demo}
          />
        ))}
      </div>
    </section>
  );
};
