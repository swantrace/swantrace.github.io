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
  const projects = await getAllProjects();

  return c.render(
    <>
      <title>Fred Hong — Full-stack Engineer</title>
      <meta
        name="description"
        content="Fred Hong is a full-stack engineer specializing in React, TypeScript, and FHIR interoperability."
      />
      <HeroSection />
      <RecentBlogPostsSection posts={recentPosts} />
      {projects.length > 0 ? <ProjectsSection projects={projects} /> : null}
    </>
  );
});
