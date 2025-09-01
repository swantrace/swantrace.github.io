import fg from "fast-glob";
import fs from "node:fs/promises";
import path from "node:path";
import { watch } from "chokidar";
import {
  getSlugFromFilename,
  parseFrontmatter,
  parseMarkdownFile,
} from "../app/utils/posts.js";

const POSTS_DIR = "./content/posts";
const OUTPUT_FILE = "./public/posts.json";

/**
 * Parse a single markdown file and extract metadata
 */
async function parsePost(filePath: string): Promise<PostMeta | null> {
  try {
    const result = await parseMarkdownFile(filePath);
    if (!result) return null;

    const { data: frontmatter, content: markdownContent } = result;
    const slug = getSlugFromFilename(filePath);

    return parseFrontmatter(frontmatter, slug, markdownContent);
  } catch (error) {
    console.error(`Error parsing post ${filePath}:`, error);
    return null;
  }
}

/**
 * Generate posts.json from all markdown files in the posts directory
 */
async function generatePosts(): Promise<void> {
  try {
    console.log("🔍 Scanning for posts...");

    // Find all markdown files in posts directory
    const postFiles = await fg(`${POSTS_DIR}/**/*.md`);
    console.log(`📄 Found ${postFiles.length} post files`);

    // Parse all posts
    const posts: PostMeta[] = [];
    for (const filePath of postFiles) {
      const post = await parsePost(filePath);
      if (post) {
        posts.push(post);
      }
    }

    // Filter out draft posts for production
    const publishedPosts = posts.filter((post) => !post.draft);

    // Sort by date (newest first)
    publishedPosts.sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Ensure output directory exists
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });

    // Write posts.json
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(publishedPosts, null, 2));

    console.log(
      `✅ Generated ${OUTPUT_FILE} with ${publishedPosts.length} published posts`
    );
    console.log(
      `   (${posts.length - publishedPosts.length} draft posts excluded)`
    );
  } catch (error) {
    console.error("❌ Error generating posts:", error);
    process.exit(1);
  }
}

/**
 * Start watching posts directory for changes
 */
function startWatch(): void {
  console.log(`👀 Watching ${POSTS_DIR} for changes...`);

  const watcher = watch(`${POSTS_DIR}/**/*.md`, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  watcher
    .on("add", (path) => {
      console.log(`📝 Post added: ${path}`);
      generatePosts();
    })
    .on("change", (path) => {
      console.log(`📝 Post changed: ${path}`);
      generatePosts();
    })
    .on("unlink", (path) => {
      console.log(`🗑️  Post deleted: ${path}`);
      generatePosts();
    });

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n👋 Stopping watch mode...");
    watcher.close();
    process.exit(0);
  });
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const watchMode = args.includes("--watch") || args.includes("-w");

  // Generate posts initially
  await generatePosts();

  if (watchMode) {
    startWatch();
  }
}

// Run the script
main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
