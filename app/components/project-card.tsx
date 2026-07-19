export const ProjectCard = ({
  title,
  description,
  tags,
  github,
  demo,
}: {
  title: string;
  description: string;
  tags: string[];
  github?: string | null;
  demo?: string | null;
}) => {
  const projectUrl = github || demo;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="text-base-content/70">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag} className="badge badge-secondary">
              {tag}
            </div>
          ))}
        </div>
        {projectUrl && (
          <div className="card-actions mt-4 justify-end">
            <a
              className="btn btn-primary"
              href={projectUrl}
              target="_blank"
              rel="noreferrer"
            >
              View Project
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
