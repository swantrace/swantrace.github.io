import path from "node:path";
import fs from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const matter = require("gray-matter");

/**
 * Extract slug from filename (remove .md extension)
 */
export function getSlugFromFilename(filename: string): string {
  return path.basename(filename, ".md");
}

/**
 * Parse frontmatter data into PostMeta format
 */
export function parseFrontmatter(
  data: any,
  slug: string,
  content: string
): PostMeta {
  // Parse topic - expect either null or [string, number]
  let topic: [string, number] | null = null;
  if (data.topic && Array.isArray(data.topic) && data.topic.length === 2) {
    const [topicName, order] = data.topic;
    if (typeof topicName === "string" && typeof order === "number") {
      topic = [topicName, order];
    }
  }

  // Ensure tags is an array
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    slug,
    title: data.title || slug,
    date: data.date ? new Date(data.date).toISOString() : null,
    tags,
    topic,
    draft: Boolean(data.draft),
    excerpt: data.excerpt || generateExcerpt(content),
  };
}

/**
 * Generate excerpt from content if not provided in frontmatter
 */
export function generateExcerpt(content: string): string {
  // Remove markdown formatting and get first 150 characters
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, "") // Remove frontmatter
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1") // Remove bold/italic
    .replace(/`([^`]+)`/g, "$1") // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]\+/g, "$1") // Remove links
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  return cleanContent.length > 150
    ? cleanContent.substring(0, 150) + "..."
    : cleanContent;
}

/**
 * Parse a markdown file and extract frontmatter and content
 */
export async function parseMarkdownFile(
  filePath: string
): Promise<{ data: any; content: string } | null> {
  try {
    const fileContents = await fs.readFile(filePath, "utf8");
    return matter(fileContents);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all post slugs from the content/posts directory
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const postsDir = "./content/posts";

    // Check if directory exists
    try {
      await fs.access(postsDir);
    } catch {
      console.warn(`Posts directory ${postsDir} does not exist`);
      return [];
    }

    // Read directory contents
    const files = await fs.readdir(postsDir, { withFileTypes: true });

    // Filter for .md files and extract slugs
    const slugs = files
      .filter((file) => file.isFile() && file.name.endsWith(".md"))
      .map((file) => getSlugFromFilename(file.name));

    return slugs;
  } catch (error) {
    console.error("Error reading post files:", error);
    return [];
  }
}

/**
 * Get recent posts for homepage display
 */
export function getRecentPosts(count: number = 3): PostMeta[] {
  try {
    const postsJsonPath = path.join(process.cwd(), "public", "posts.json");
    const postsData = JSON.parse(
      require("fs").readFileSync(postsJsonPath, "utf-8")
    );
    return postsData
      .sort((a: PostMeta, b: PostMeta) => {
        return (
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        );
      })
      .slice(0, count);
  } catch (error) {
    console.warn("Could not load posts.json:", error);
    return [];
  }
}

/**
 * Get a single post by slug with content and frontmatter
 */
export async function getPostBySlug(
  slug: string
): Promise<{ content: string; frontmatter: PostMeta } | null> {
  try {
    const postsDirectory = path.join(process.cwd(), "content/posts");
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    const result = await parseMarkdownFile(fullPath);
    if (!result) return null;

    const { data, content } = result;
    const frontmatter = parseFrontmatter(data, slug, content);

    return { content, frontmatter };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}
