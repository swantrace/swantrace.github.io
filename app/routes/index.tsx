import { createRoute } from "honox/factory";
import { HeroSection } from "../components/hero-section";
import { RecentBlogPostsSection } from "../components/recent-blog-posts-section";
import { ProjectsSection } from "../components/projects-section";
import { getAllProjects } from "../utils/projects";
import { getRecentPosts } from "../utils/posts";

export default createRoute(async (c) => {
  // Load recent blog posts
  const recentPosts = getRecentPosts(3);

  // Load projects using the utility function
  const projects = await getAllProjects();

  return c.render(
    <>
      <title>Portfolio — Home</title>
      <meta name="description" content="Welcome to my portfolio website." />
      <HeroSection />
      <RecentBlogPostsSection posts={recentPosts} />
      <ProjectsSection projects={projects} />
    </>
  );
});
