import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { getAllPostSlugs } from "../../utils/posts.js";

export default createRoute(
  ssgParams(async () => {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
  })
);
