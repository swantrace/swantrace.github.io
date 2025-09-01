import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  featured: boolean;
  order: number;
}

async function generateProjects() {
  console.log("🔍 Scanning for projects...");

  const projectsDir = path.join(process.cwd(), "content", "projects");
  const outputPath = path.join(process.cwd(), "public", "projects.json");

  if (!fs.existsSync(projectsDir)) {
    console.warn("⚠️  Projects directory not found");
    return;
  }

  const files = fs
    .readdirSync(projectsDir)
    .filter((file) => file.endsWith(".md"));
  console.log(`📄 Found ${files.length} project files`);

  const projects: ProjectMeta[] = [];

  for (const file of files) {
    const filePath = path.join(projectsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);

    const slug = path.basename(file, ".md");

    projects.push({
      slug,
      title: data.title || slug,
      description: data.description || "",
      image: data.image || "",
      tags: data.tags || [],
      featured: data.featured || false,
      order: data.order || 999,
    });
  }

  // Sort by order, then by title
  projects.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  // Write projects.json
  fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));

  console.log(
    `✅ Generated ./public/projects.json with ${projects.length} projects`
  );
}

generateProjects().catch(console.error);
