import { ssgParams } from "hono/ssg";
import { createRoute } from "honox/factory";
import { getPublishedProjectSlugs } from "../../utils/projects";

export default createRoute(
  ssgParams(async () => {
    const slugs = await getPublishedProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  })
);
