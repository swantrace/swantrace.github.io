export const RecentPostCard = ({
  slug,
  title,
  excerpt,
  tags,
  date,
}: {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string | null;
}) => {
  return (
    <div className="card bg-base-100 shadow-xl transition-shadow hover:shadow-2xl">
      <div className="card-body">
        <h2 className="card-title">
          <a href={`/blog/${slug}`} className="link link-hover">
            {title}
          </a>
        </h2>
        <p className="text-base-content/70">{excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <div key={tag} className="badge badge-primary badge-outline">
              {tag}
            </div>
          ))}
        </div>
        {date && (
          <div className="card-actions justify-end">
            <div className="text-sm opacity-70">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
