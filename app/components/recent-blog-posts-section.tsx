import { url } from "../utils/url";
import { RecentPostCard } from "./recent-post-card";
import { SectionTitle } from "./section-title";

export const RecentBlogPostsSection = ({ posts }: { posts: PostMeta[] }) => {
  return (
    <section id="blog" className="mb-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <SectionTitle>Latest from the blog</SectionTitle>
        <a
          href={url("/blog")}
          className="link link-hover text-base-content/65 text-sm"
        >
          All articles →
        </a>
      </div>

      <div className="space-y-3">
        {posts.length === 0 && (
          <p className="text-base-content/60 px-4 py-6">
            New articles are on the way. Check back soon.
          </p>
        )}
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
    </section>
  );
};
