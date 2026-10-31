import { url } from "../utils/url";

export const ProjectCard = ({
  slug,
  title,
  description,
  tags,
  github,
  demo,
  image,
  category,
  status,
  order,
}: ProjectMeta) => {
  const imageUrl = image
    ? /^(https?:)?\/\//.test(image) || image.startsWith("data:")
      ? image
      : url(image)
    : null;

  return (
    <article className="card portfolio-card sm:card-side">
      {imageUrl ? (
        <figure className="project-cover self-start rounded-lg!">
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            width={960}
            height={600}
          />
        </figure>
      ) : (
        <div className="project-cover case-study-cover" aria-hidden="true">
          <span className="self-start font-mono text-xs tracking-widest opacity-60">
            {String(order).padStart(2, "0")} / CASE STUDY
          </span>
          <span className="font-mono text-5xl tracking-tighter">&lt;/&gt;</span>
          <span className="self-end font-mono text-xs opacity-60">
            {tags[0]}
          </span>
        </div>
      )}
      <div className="card-body min-w-0 gap-3 p-0">
        {(category || status) && (
          <p className="text-base-content/65 font-mono text-xs leading-relaxed">
            {[category, status].filter(Boolean).join(" / ")}
          </p>
        )}
        <h2 className="card-title text-xl leading-snug">
          <a className="link link-hover" href={url(`/projects/${slug}`)}>
            {title}
          </a>
        </h2>
        <p className="text-base-content/70 text-sm leading-relaxed sm:text-base">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 5).map((tag) => (
            <div key={tag} className="badge badge-ghost badge-sm">
              {tag}
            </div>
          ))}
        </div>
        <div className="card-actions items-center gap-x-5 gap-y-2 text-sm">
          {github && (
            <a
              className="link link-hover text-base-content/65"
              href={github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          )}
          {demo && (
            <a
              className="link link-hover text-base-content/65"
              href={demo}
              target="_blank"
              rel="noreferrer"
            >
              Visit app ↗
            </a>
          )}
          <a
            className="link link-hover font-medium"
            href={url(`/projects/${slug}`)}
          >
            Read case study <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
