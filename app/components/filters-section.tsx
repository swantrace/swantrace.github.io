interface FiltersSectionProps {
  posts: PostMeta[];
}

export const FiltersSection = ({ posts }: FiltersSectionProps) => {
  // Get all unique tags and topics for filters in a single loop
  const getAllTagsAndTopics = () => {
    const tags = new Set<string>();
    const topics = new Set<string>();

    posts.forEach((post) => {
      // Collect tags
      post.tags.forEach((tag) => {
        tags.add(tag);
      });

      // Collect topics
      if (post.topic) topics.add(post.topic[0]);
    });

    return {
      allTags: Array.from(tags).sort(),
      allTopics: Array.from(topics).sort(),
    };
  };

  const { allTags, allTopics } = getAllTagsAndTopics();

  return (
    <div className="blog-filters space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-base-content/70 text-sm font-medium">
          Filter by tags:
        </span>
        {allTags.map((tag) => (
          <button
            type="button"
            key={tag}
            className="btn btn-ghost btn-sm"
            disabled
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-base-content/70 text-sm font-medium">
          Filter by topic:
        </span>
        <button type="button" className="btn btn-sm" disabled>
          All Topics
        </button>
        {allTopics.map((topic) => (
          <button
            type="button"
            key={topic}
            className="btn btn-ghost btn-sm"
            disabled
          >
            {topic}
          </button>
        ))}
      </div>

      <noscript>
        <p className="text-base-content/60 text-sm italic">
          🔧 Enable JavaScript for interactive filtering and pagination
        </p>
      </noscript>
    </div>
  );
};
