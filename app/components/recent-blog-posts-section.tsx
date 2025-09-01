import { SectionTitle } from "./section-title";
import { RecentPostCard } from "./recent-post-card";

export const RecentBlogPostsSection = ({ posts }: { posts: PostMeta[] }) => {
  return (
    <section id="blog" className="mt-20 mb-16 text-center md:text-left">
      <SectionTitle>Recent Articles</SectionTitle>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <RecentPostCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            tags={post.tags}
            date={post.date}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href="/blog"
          className="inline-block bg-windsurfing hover:bg-marina text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          View all articles
        </a>
      </div>
    </section>
  );
};
