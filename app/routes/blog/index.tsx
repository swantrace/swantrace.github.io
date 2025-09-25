import { createRoute } from "honox/factory";
import fs from "node:fs";
import path from "node:path";
import { FiltersSection } from "../../components/filters-section";
import { ResultInfo } from "../../components/result-info";
import { PostList } from "../../components/post-list";

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
    <>
      <title>Blog</title>
      <meta
        name="description"
        content="Thoughts, tutorials, and insights on web development, technology, and more."
      />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <nav className="mb-6">
          <a
            href="/"
            className="text-windsurfing hover:text-marina inline-flex items-center transition-colors"
          >
            ← Back to Home
          </a>
        </nav>

        <header className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Blog
          </h1>
          <p className="dark:text-blue-dark text-lg text-gray-600">
            Thoughts, tutorials, and insights on web development, technology,
            and more.
          </p>
        </header>

        <main>
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
        </main>
      </div>
    </>
  );
});
