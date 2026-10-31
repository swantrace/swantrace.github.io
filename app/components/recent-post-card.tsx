import { url } from "../utils/url";

export const RecentPostCard = ({
  slug,
  title,
  excerpt,
  tags,
  date,
  topic,
}: Pick<PostMeta, "slug" | "title" | "excerpt" | "tags" | "date"> & {
  topic?: PostMeta["topic"];
}) => (
  <article className="card post-card">
    <div className="card-body gap-3 p-0">
      <div className="post-meta">
        {date && (
          <time dateTime={date}>
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </time>
        )}
        {topic && <span>{topic[0]}</span>}
      </div>
      <h2 className="card-title text-xl leading-snug">
        <a href={url(`/blog/${slug}`)} className="link link-hover">
          {title}{" "}
          <span className="text-base-content/40" aria-hidden="true">
            ↗
          </span>
        </a>
      </h2>
      <p className="text-base-content/70 text-sm leading-relaxed sm:text-base">
        {excerpt}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="badge badge-ghost badge-sm">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </article>
);
