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
    <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold">
          <a
            href={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            {post.title}
          </a>
        </h2>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <time dateTime={post.date || ""}>{formatDate(post.date)}</time>

          {post.topic && (
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              📚 {post.topic[0]}
            </span>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="mt-4">
        <p className="text-gray-700 leading-relaxed">{post.excerpt}</p>
        <a
          href={`/blog/${post.slug}`}
          className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Read more →
        </a>
      </div>
    </article>
  );
};
