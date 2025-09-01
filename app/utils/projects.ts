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
 * Parse frontmatter data into ProjectMeta format
 */
export function parseProjectFrontmatter(
  data: any,
  slug: string,
  content: string
): ProjectMeta {
  // Ensure tags is an array
  const tags = Array.isArray(data.tags) ? data.tags : [];

  return {
    slug,
    title: data.title || slug,
    description: data.description || generateExcerpt(content),
    tags,
    github: data.github || null,
    demo: data.demo || null,
    image: data.image || null,
    featured: Boolean(data.featured),
    order: typeof data.order === "number" ? data.order : 999,
  };
}

/**
 * Generate description from content if not provided in frontmatter
 */
export function generateExcerpt(content: string): string {
  // Remove markdown formatting and get first 120 characters
  const cleanContent = content
    .replace(/^---[\s\S]*?---/, "") // Remove frontmatter
    .replace(/#{1,6}\s+/g, "") // Remove headers
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1") // Remove bold/italic
    .replace(/`([^`]+)`/g, "$1") // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
    .replace(/\n+/g, " ") // Replace newlines with spaces
    .trim();

  return cleanContent.length > 120
    ? cleanContent.substring(0, 120) + "..."
    : cleanContent;
}

/**
 * Parse a markdown file and extract frontmatter and content
 */
export async function parseProjectMarkdownFile(
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
 * Get all project slugs from the content/projects directory
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const projectsDir = "./content/projects";

    // Check if directory exists
    try {
      await fs.access(projectsDir);
    } catch {
      console.warn(`Projects directory ${projectsDir} does not exist`);
      return [];
    }

    // Read directory contents
    const files = await fs.readdir(projectsDir, { withFileTypes: true });

    // Filter for .md files and extract slugs
    const slugs = files
      .filter((file) => file.isFile() && file.name.endsWith(".md"))
      .map((file) => getSlugFromFilename(file.name));

    return slugs;
  } catch (error) {
    console.error("Error reading project files:", error);
    return [];
  }
}

/**
 * Load all projects from content/projects
 */
export async function getAllProjects(): Promise<ProjectMeta[]> {
  const slugs = await getAllProjectSlugs();
  const projects: ProjectMeta[] = [];

  for (const slug of slugs) {
    const filePath = path.join("./content/projects", `${slug}.md`);
    const parsed = await parseProjectMarkdownFile(filePath);

    if (parsed) {
      const project = parseProjectFrontmatter(
        parsed.data,
        slug,
        parsed.content
      );
      projects.push(project);
    }
  }

  // Sort by order, then by title
  return projects.sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.title.localeCompare(b.title);
  });
}
