import { expect, test } from "@playwright/test";

const cases = [
  ["x509-trust", "x509-trust"],
  ["english-speaking-coach", "English Speaking Coach"],
  ["job-application-tracker", "Job Application Tracker"],
  ["luxebbq", "Luxe BBQ — Product Discovery & Catalogue Management"],
];

test("featured work and all four project pages expose the intended links", async ({
  page,
}) => {
  // Allow the complete multi-page workflow to finish on slower browser engines.
  test.setTimeout(60_000);
  await page.goto("/");
  const featured = page.locator("#projects .portfolio-card");
  await expect(featured).toHaveCount(3);
  for (let index = 0; index < 3; index++) {
    await expect(featured.nth(index).getByRole("heading")).toHaveText(
      cases[index][1]
    );
  }
  await page.goto("/projects");
  await expect(page.locator(".portfolio-card")).toHaveCount(4);
  expect(
    (
      await page.request.get("/projects/consent-aware-ehr-data-exchange")
    ).status()
  ).toBe(404);
  expect(
    (
      await page.request.get(
        "/projects/healthcare-consent-management-dashboard"
      )
    ).status()
  ).toBe(404);
  const cover = await page.locator(".project-cover").first().boundingBox();
  expect(cover).not.toBeNull();
  if (cover) {
    expect(cover.width / cover.height).toBeCloseTo(1.6, 1);
  }

  for (const [slug, title] of cases) {
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator(".blog-content")).toBeVisible();
    await expect(page.locator(".blog-content")).toHaveText(/\S/);
    const illustration = page.locator("main figure img");
    await expect(illustration).toHaveAttribute(
      "src",
      `/images/projects/${slug}.svg`
    );
    await expect
      .poll(() =>
        illustration.evaluate((image: HTMLImageElement) => image.naturalWidth)
      )
      .toBeGreaterThan(0);
    if (slug === "luxebbq") {
      await expect(
        page.getByRole("link", { name: "Current client website" })
      ).toHaveAttribute("href", "https://luxebbq.ca/");
      await expect(
        page.getByRole("link", { name: "Catalogue module source" })
      ).toHaveAttribute("href", /luxebbq-custom-specific-module/);
      await expect(page.getByRole("link", { name: "Visit app" })).toHaveCount(
        0
      );
    }
    if (slug === "x509-trust") {
      await expect(
        page.getByRole("link", { name: "npm package" })
      ).toHaveAttribute("href", "https://www.npmjs.com/package/x509-trust");
    }
  }
});

test("long case studies fit a narrow screen without JavaScript", async ({
  browser,
}) => {
  test.setTimeout(60_000);
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 844 },
  });
  const page = await context.newPage();
  for (const [slug, title] of cases) {
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  }
  await context.close();
});
