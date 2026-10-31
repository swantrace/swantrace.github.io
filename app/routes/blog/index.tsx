import fs from "node:fs";
import path from "node:path";
import { createRoute } from "honox/factory";
import { FiltersSection } from "../../components/filters-section";
import { PostList } from "../../components/post-list";
import { ResultInfo } from "../../components/result-info";
import { url } from "../../utils/url";

export default createRoute(async (c) => {
  // Load posts data at build time
  const postsJsonPath = path.join(process.cwd(), "public", "posts.json");
  let posts: PostMeta[] = [];

  try {
    const postsData = JSON.parse(fs.readFileSync(postsJsonPath, "utf-8"));
    posts = postsData.sort((a: PostMeta, b: PostMeta) => {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });
  } catch (error) {
    console.warn("Could not load posts.json for SSR:", error);
  }

  return c.render(
    <main className="blog-index">
      <title>Blog</title>
      <meta
        name="description"
        content="Thoughts, tutorials, and insights on web development, technology, and more."
      />
      <div className="py-8">
        <nav className="mb-6">
          <a
            href={url("/")}
            className="link link-hover text-base-content/60 text-sm"
          >
            ← Back to Home
          </a>
        </nav>

        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Blog
          </h1>
          <p className="text-base-content/70 text-lg leading-relaxed">
            Thoughts, tutorials, and insights on web development, technology,
            and more.
          </p>
        </header>

        <section aria-label="Blog posts">
          {/* Progressive enhancement: Static content with JavaScript enhancement */}
          <div
            className="space-y-6"
            is="blog-list-div"
            posts-data={JSON.stringify(posts)}
          >
            {/* Static fallback content - will be replaced by JavaScript when available */}

            {/* Filters Section - Static (non-functional) */}
            <FiltersSection posts={posts} />

            {/* Results Info */}
            <ResultInfo posts={posts} />

            {/* Posts List */}
            <PostList posts={posts} />
          </div>
        </section>
      </div>
    </main>
  );
});
