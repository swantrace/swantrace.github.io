import { expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import {
  getAllProjects,
  getProjectBySlug,
  getPublishedProjectSlugs,
  parseProjectFrontmatter,
} from "../app/utils/projects";

test("the published catalogue has four illustrated case studies and three featured projects", async () => {
  const projects = await getAllProjects();
  expect(projects).toHaveLength(4);
  expect(projects.map((project) => project.slug)).not.toContain(
    "consent-aware-ehr-data-exchange"
  );
  expect(projects.map((project) => project.slug)).not.toContain(
    "healthcare-consent-management-dashboard"
  );
  expect(
    projects
      .filter((project) => project.featured)
      .map((project) => project.slug)
  ).toEqual([
    "x509-trust",
    "english-speaking-coach",
    "job-application-tracker",
  ]);
  expect((await getPublishedProjectSlugs()).sort()).toEqual(
    projects.map((project) => project.slug).sort()
  );
  for (const project of projects) {
    expect(project.category).toBeTruthy();
    expect(project.status).toBeTruthy();
    expect(project.role).toBeTruthy();
    expect(project.imageAlt).toBeTruthy();
    expect(project.image).toStartWith("/images/projects/");
    const illustration = await readFile(`public${project.image}`, "utf8");
    expect(illustration).toContain('viewBox="0 0 960 600"');
  }
});

test("project content preserves deployment and historical attribution boundaries", async () => {
  const coach = await getProjectBySlug("english-speaking-coach");
  expect(coach?.frontmatter.tags).toContain("libSQL / Turso");
  expect(coach?.frontmatter.tags).not.toContain("PostgreSQL");
  expect(coach?.frontmatter.github).toBe(
    "https://github.com/swantrace/english-speaking-coach"
  );
  expect(coach?.frontmatter.demoNote).toContain("personal-use environment");

  const luxe = await getProjectBySlug("luxebbq");
  expect(luxe?.frontmatter.demo).toBeNull();
  expect(luxe?.frontmatter.sourceNote).toContain("not a live demonstration");
  expect(luxe?.frontmatter.links).toContainEqual({
    label: "Catalogue module source",
    href: "https://github.com/swantrace/luxebbq-custom-specific-module",
  });

  const tracker = await getProjectBySlug("job-application-tracker");
  expect(tracker?.frontmatter.demo).toBeNull();
});

test("additional project links tolerate missing and malformed frontmatter", () => {
  expect(parseProjectFrontmatter({}, "example", "").links).toEqual([]);
  expect(
    parseProjectFrontmatter(
      {
        links: [
          null,
          {},
          { label: "npm", href: 1 },
          { label: "npm", href: "https://www.npmjs.com/package/x509-trust" },
        ],
      },
      "example",
      ""
    ).links
  ).toEqual([
    { label: "npm", href: "https://www.npmjs.com/package/x509-trust" },
  ]);
});
