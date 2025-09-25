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
    <article className="bg-whiteish rounded-[24px_0] p-6 dark:bg-[var(--color-projects-dark)]">
      <h3 className="m-0 text-xl">{title}</h3>
      <div className="mt-4">
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800"
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
