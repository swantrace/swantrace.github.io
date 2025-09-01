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
    <article className="rounded-[24px_0] bg-whiteish p-6 dark:bg-[var(--color-projects-dark)]">
      <h3 className="m-0 text-xl">{title}</h3>
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {projectUrl ? (
        <p className="mt-4">
          <a
            className="text-windsurfing hover:text-marina"
            href={projectUrl}
            target="_blank"
          >
            View project
          </a>
        </p>
      ) : null}
    </article>
  );
};

export default ProjectCard;
