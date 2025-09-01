import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { urlAbs } from "../app/utils/url.js";

const POSTS_JSON_PATH = "./public/posts.json";
const SITEMAP_OUTPUT_PATH = "./public/sitemap.xml";

/**
 * Static routes of the website
 */
const STATIC_ROUTES = [
  "/", // Home page
  "/blog", // Blog listing page
];

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
  Array<{ url: string; lastmod: string }>
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
      lastmod: post.date
        ? new Date(post.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
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

    // Start XML
    const xmlLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ];

    // Add static routes
    for (const route of STATIC_ROUTES) {
      const url = urlAbs(route);
      const priority = route === "/" ? "1.0" : "0.8";
      const changefreq = route === "/" ? "weekly" : "monthly";

      xmlLines.push(generateSitemapEntry(url, undefined, changefreq, priority));
    }

    // Add blog post routes
    for (const { url, lastmod } of blogPostUrls) {
      xmlLines.push(generateSitemapEntry(url, lastmod, "monthly", "0.6"));
    }

    // Close XML
    xmlLines.push("</urlset>");

    // Write sitemap
    const sitemapContent = xmlLines.join("\n");
    await writeFile(SITEMAP_OUTPUT_PATH, sitemapContent);

    console.log(
      `✅ Generated ${SITEMAP_OUTPUT_PATH} with ${
        STATIC_ROUTES.length + blogPostUrls.length
      } URLs`
    );
    console.log(`   Static routes: ${STATIC_ROUTES.length}`);
    console.log(`   Blog posts: ${blogPostUrls.length}`);
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
