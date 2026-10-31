import { createRoute } from "honox/factory";
import { HeroSection } from "../components/hero-section";
import { ProjectsSection } from "../components/projects-section";
import { RecentBlogPostsSection } from "../components/recent-blog-posts-section";
import { getRecentPosts } from "../utils/posts";
import { getAllProjects } from "../utils/projects";

export default createRoute(async (c) => {
  // Load recent blog posts
  const recentPosts = getRecentPosts(3);

  // Load projects using the utility function
  const projects = (await getAllProjects()).filter(
    (project) => project.featured
  );

  return c.render(
    <>
      <title>Fred Hong — Senior Full-stack Engineer</title>
      <meta
        name="description"
        content="Fred Hong is a senior full-stack engineer building complex web applications with React, TypeScript, and Node.js, with experience in healthcare interoperability, security, and AI applications."
      />
      <main>
        <HeroSection />
        {projects.length > 0 ? <ProjectsSection projects={projects} /> : null}
        <RecentBlogPostsSection posts={recentPosts} />
      </main>
    </>
  );
});
