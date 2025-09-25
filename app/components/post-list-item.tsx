interface PostMeta {
  slug: string;
  title: string;
  date: string | null;
  tags: string[];
  topic: [string, number] | null;
  draft: boolean;
  excerpt: string;
}

interface PostListItemProps {
  post: PostMeta;
}

// Format date helper
const formatDate = (dateString: string | null) => {
  if (!dateString) return "No date";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const PostListItem = ({ post }: PostListItemProps) => {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold">
          <a
            href={`/blog/${post.slug}`}
            className="text-blue-600 transition-colors hover:text-blue-800"
          >
            {post.title}
          </a>
        </h2>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <time dateTime={post.date || ""}>{formatDate(post.date)}</time>

          {post.topic && (
            <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-800">
              📚 {post.topic[0]}
            </span>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="mt-4">
        <p className="leading-relaxed text-gray-700">{post.excerpt}</p>
        <a
          href={`/blog/${post.slug}`}
          className="mt-2 inline-block font-medium text-blue-600 transition-colors hover:text-blue-800"
        >
          Read more →
        </a>
      </div>
    </article>
  );
};
