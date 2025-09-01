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
      post.tags.forEach((tag) => tags.add(tag));

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
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-gray-700">Filter by tags:</span>
        {allTags.map((tag) => (
          <button
            key={tag}
            className="px-3 py-1 text-sm rounded-full border bg-white text-gray-700 border-gray-300 hover:border-blue-300 transition-colors cursor-not-allowed opacity-75"
            disabled
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium text-gray-700">Filter by topic:</span>
        <button
          className="px-3 py-1 text-sm rounded-full border bg-blue-500 text-white border-blue-500 cursor-not-allowed opacity-75"
          disabled
        >
          All Topics
        </button>
        {allTopics.map((topic) => (
          <button
            key={topic}
            className="px-3 py-1 text-sm rounded-full border bg-white text-gray-700 border-gray-300 hover:border-blue-300 transition-colors cursor-not-allowed opacity-75"
            disabled
          >
            {topic}
          </button>
        ))}
      </div>

      <noscript>
        <p className="text-sm text-gray-500 italic">
          🔧 Enable JavaScript for interactive filtering and pagination
        </p>
      </noscript>
    </div>
  );
};
