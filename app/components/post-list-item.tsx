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
    <div className="card bg-base-100 shadow-xl transition-shadow hover:shadow-2xl">
      <div className="card-body">
        <h2 className="card-title">
          <a href={`/blog/${post.slug}`} className="link link-hover">
            {post.title}
          </a>
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm opacity-70">
            <time dateTime={post.date || ""}>{formatDate(post.date)}</time>
          </div>

          {post.topic && (
            <div className="badge badge-secondary">📚 {post.topic[0]}</div>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <div key={tag} className="badge badge-outline">
                #{tag}
              </div>
            ))}
          </div>
        )}

        <p className="text-base-content/70">{post.excerpt}</p>

        <div className="card-actions justify-end">
          <a href={`/blog/${post.slug}`} className="btn btn-primary btn-sm">
            Read more →
          </a>
        </div>
      </div>
    </div>
  );
};
