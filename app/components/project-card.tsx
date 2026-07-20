import { url } from "../utils/url";

export const ProjectCard = ({
  slug,
  title,
  description,
  tags,
  github,
  demo,
  image,
}: ProjectMeta) => {
  const imageUrl = image
    ? /^(https?:)?\/\//.test(image) || image.startsWith("data:")
      ? image
      : url(image)
    : null;

  return (
    <article className="card bg-base-100 shadow-xl">
      {imageUrl && (
        <figure className="aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title">
          <a className="link link-hover" href={url(`/projects/${slug}`)}>
            {title}
          </a>
        </h2>
        <p className="text-base-content/70">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag} className="badge badge-secondary">
              {tag}
            </div>
          ))}
        </div>
        <div className="card-actions mt-4 items-center justify-end">
          {github && (
            <a
              className="btn btn-ghost btn-sm"
              href={github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
          {demo && (
            <a
              className="btn btn-ghost btn-sm"
              href={demo}
              target="_blank"
              rel="noreferrer"
            >
              Live demo
            </a>
          )}
          <a className="btn btn-primary btn-sm" href={url(`/projects/${slug}`)}>
            Read case study
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
