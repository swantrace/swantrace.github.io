import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { getPublishedPostSlugs } from "../../utils/posts.js";

export default createRoute(
  ssgParams(async () => {
    const slugs = await getPublishedPostSlugs();
    return slugs.map((slug) => ({ slug }));
  })
);
