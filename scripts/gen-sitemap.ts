import { existsSync } from "node:fs";
import { readFile, stat, writeFile } from "node:fs/promises";
import { getAllProjects } from "../app/utils/projects.js";
import { urlAbs } from "../app/utils/url.js";

const POSTS_JSON_PATH = "./public/posts.json";
const SITEMAP_OUTPUT_PATH = "./public/sitemap.xml";

/**
 * Static routes of the website
 */
const STATIC_ROUTES = [
  ["/", "./app/routes/index.tsx"],
  ["/blog", "./app/routes/blog/index.tsx"],
  ["/projects", "./app/routes/projects/index.tsx"],
  ["/cv", "./app/routes/cv.tsx"],
] as const;

async function getLastModifiedDate(filePath: string): Promise<string> {
  const { mtime } = await stat(filePath);
  return mtime.toISOString().split("T")[0];
}

/**
 * Generate XML sitemap entry for a URL
 */
function generateSitemapEntry(
  url: string,
  lastmod?: string,
  changefreq?: string,
  priority?: string
): string {
  const entry = [`  <url>`];
  entry.push(`    <loc>${url}</loc>`);

  if (lastmod) {
    entry.push(`    <lastmod>${lastmod}</lastmod>`);
  }

  if (changefreq) {
    entry.push(`    <changefreq>${changefreq}</changefreq>`);
  }

  if (priority) {
    entry.push(`    <priority>${priority}</priority>`);
  }

  entry.push(`  </url>`);
  return entry.join("\n");
}

/**
 * Read posts.json and extract blog post URLs
 */
async function getBlogPostUrls(): Promise<
  Array<{ url: string; filePath: string }>
> {
  if (!existsSync(POSTS_JSON_PATH)) {
    console.warn(`⚠️  ${POSTS_JSON_PATH} not found. Run gen:posts first.`);
    return [];
  }

  try {
    const postsContent = await readFile(POSTS_JSON_PATH, "utf-8");
    const posts: PostMeta[] = JSON.parse(postsContent);

    return posts.map((post) => ({
      url: urlAbs(`/blog/${post.slug}`),
      filePath: `./content/posts/${post.slug}.md`,
    }));
  } catch (error) {
    console.error(`❌ Error reading ${POSTS_JSON_PATH}:`, error);
    return [];
  }
}

/**
 * Generate complete sitemap XML
 */
async function generateSitemap(): Promise<void> {
  try {
    console.log("🗺️  Generating sitemap...");

    // Get blog post URLs
    const blogPostUrls = await getBlogPostUrls();
    console.log(`📄 Found ${blogPostUrls.length} blog posts`);
    const projects = await getAllProjects();
    console.log(`🛠️  Found ${projects.length} projects`);

    // Start XML
    const xmlLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ];

    // Add static routes
    for (const [route, filePath] of STATIC_ROUTES) {
      const url = urlAbs(route);
      const lastmod = await getLastModifiedDate(filePath);
      const priority = route === "/" ? "1.0" : "0.8";
      const changefreq = route === "/" ? "weekly" : "monthly";

      xmlLines.push(generateSitemapEntry(url, lastmod, changefreq, priority));
    }

    // Add blog post routes
    for (const { url, filePath } of blogPostUrls) {
      const lastmod = await getLastModifiedDate(filePath);
      xmlLines.push(generateSitemapEntry(url, lastmod, "monthly", "0.6"));
    }

    // Add published project routes
    for (const project of projects) {
      const url = urlAbs(`/projects/${project.slug}`);
      const lastmod = await getLastModifiedDate(
        `./content/projects/${project.slug}.md`
      );
      xmlLines.push(generateSitemapEntry(url, lastmod, "monthly", "0.7"));
    }

    // Close XML
    xmlLines.push("</urlset>");

    // Write sitemap
    const sitemapContent = xmlLines.join("\n");
    await writeFile(SITEMAP_OUTPUT_PATH, sitemapContent);

    console.log(
      `✅ Generated ${SITEMAP_OUTPUT_PATH} with ${
        STATIC_ROUTES.length + blogPostUrls.length + projects.length
      } URLs`
    );
    console.log(`   Static routes: ${STATIC_ROUTES.length}`);
    console.log(`   Blog posts: ${blogPostUrls.length}`);
    console.log(`   Projects: ${projects.length}`);
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  await generateSitemap();
}

// Run the script
main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
