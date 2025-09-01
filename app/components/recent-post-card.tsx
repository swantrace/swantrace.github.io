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
    <article className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-2">
        <a
          href={`/blog/${slug}`}
          className="text-gray-900 dark:text-white hover:text-windsurfing dark:hover:text-blue-dark transition-colors"
        >
          {title}
        </a>
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{excerpt}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-windsurfing/10 text-windsurfing dark:bg-blue-dark/20 dark:text-blue-dark px-2 py-1 rounded-md"
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
