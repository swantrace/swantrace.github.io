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
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-2 text-lg font-semibold">
        <a
          href={`/blog/${slug}`}
          className="hover:text-windsurfing dark:hover:text-blue-dark text-gray-900 transition-colors dark:text-white"
        >
          {title}
        </a>
      </h3>
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">{excerpt}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="bg-windsurfing/10 text-windsurfing dark:bg-blue-dark/20 dark:text-blue-dark rounded-md px-2 py-1 text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      {date && (
        <time className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      )}
    </article>
  );
};
