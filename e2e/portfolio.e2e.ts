import { expect, type Page, test } from "@playwright/test";
import { processMarkdown } from "../app/utils/markdown";

// Exercise populated cards without publishing any of the portfolio's drafts.
const seedPosts = async (page: Page) => {
  const posts: PostMeta[] = Array.from({ length: 12 }, (_, i) => ({
    slug: "typescript-generics-and-generic-constraints",
    title: `TypeScript article ${i + 1}`,
    date: "2026-10-01T00:00:00.000Z",
    tags: i % 2 === 0 ? ["typescript", "generics"] : ["javascript"],
    topic: [i % 2 === 0 ? "Typed applications" : "Web development", i],
    draft: false,
    excerpt:
      "Notes on web development, type safety, and building reliable applications.",
  }));
  await expect(page.locator("blog-list")).toBeAttached();
  await page.locator("blog-list").evaluate((element, data) => {
    element.setAttribute("posts-data", JSON.stringify(data));
  }, posts);
};

for (const width of [1440, 768, 390, 320]) {
  test(`navigation and content fit a ${width}px viewport`, async ({
    page,
    browserName,
  }) => {
    // This smoke test visits six routes, including interactive Markdown demos.
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "I'm Fred Hong" })
    ).toBeVisible();
    await expect(page.locator("main")).toHaveCount(1);

    const navigation = page.getByRole("navigation", {
      name: "Main navigation",
    });
    await expect(
      navigation.getByRole("link", { name: "Home", exact: true })
    ).toHaveAttribute("aria-current", "page");

    const checkOverflow = async () => {
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        )
      ).toBe(true);
    };
    await checkOverflow();

    await navigation
      .getByRole("link", { name: "Projects", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Projects", exact: true })
    ).toBeVisible();
    await expect(page.locator(".portfolio-card")).toHaveCount(4);
    await checkOverflow();

    await page.getByRole("link", { name: "Read case study" }).first().click();
    await expect(page.locator(".blog-content")).toBeVisible();
    await expect(page.locator(".blog-content")).toHaveText(/\S/);
    await expect(
      navigation.getByRole("link", { name: "Projects", exact: true })
    ).toHaveAttribute("aria-current", "page");
    await checkOverflow();

    await navigation.getByRole("link", { name: "Blog", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Blog", exact: true })
    ).toBeVisible();
    if (browserName !== "webkit") {
      await seedPosts(page);
      await expect(page.locator(".post-card").first()).toBeVisible();
    }
    await checkOverflow();

    await page.goto("/blog/interactive-markdown-demo-test");
    await expect(page.locator(".blog-content")).toBeVisible();
    const renderedMarkdown = await processMarkdown(
      "Inline math: $E = mc^2$\n\n```typescript\nconst answer: number = 42;\n```"
    );
    await page.locator(".blog-content").evaluate((element, markup) => {
      element.insertAdjacentHTML("beforeend", markup);
    }, renderedMarkdown);
    await expect(page.locator(".katex").first()).toBeVisible();
    await expect(
      page.locator(".code-with-lines code.hljs .hljs-keyword").last()
    ).toBeVisible();
    await checkOverflow();

    await navigation.getByRole("link", { name: "CV", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Fred Hong", exact: true })
    ).toBeVisible();
    await checkOverflow();
  });
}

test("the existing theme component persists preferences across routes and reloads", async ({
  page,
}) => {
  await page.goto("/");
  const toggle = page
    .locator("theme-switcher")
    .getByRole("checkbox", { name: "Dark theme" });
  await toggle.check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect(toggle).toBeChecked();
  await page.reload();
  await expect(toggle).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await toggle.uncheck();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("blog filters, pagination, and article links remain usable", async ({
  page,
  browserName,
}) => {
  // WebKit retains the SSR fallback because it does not support customized built-in elements.
  test.skip(
    browserName === "webkit",
    "WebKit uses the existing static blog fallback."
  );
  await page.goto("/blog");
  const blog = page.locator("blog-list");
  await seedPosts(page);
  await expect(blog.locator(".post-card")).toHaveCount(10);
  await blog.getByRole("button", { name: "typescript", exact: true }).click();
  await expect(page).toHaveURL(/tag=typescript/);
  await expect(
    blog.getByRole("button", { name: "typescript", exact: true })
  ).toHaveAttribute("aria-pressed", "true");
  await expect(blog.locator(".post-card").first()).toContainText("TypeScript");
  await blog
    .getByRole("button", { name: "Clear Filters", exact: true })
    .click();
  await blog
    .getByRole("button", { name: "Typed applications", exact: true })
    .click();
  await expect(blog.locator(".post-card")).toHaveCount(6);
  await expect(page).toHaveURL(/topic=Typed\+applications/);
  await blog
    .getByRole("button", { name: "Clear Filters", exact: true })
    .click();
  await blog.getByLabel("Posts per page:").selectOption("5");
  await expect(blog.locator(".post-card")).toHaveCount(5);
  const firstTitle = await blog.locator(".post-card h2").first().textContent();
  await blog.getByRole("button", { name: "Next", exact: true }).click();
  await expect(blog.locator(".post-card h2").first()).not.toHaveText(
    firstTitle || ""
  );
  await blog.locator(".post-card h2 a").first().click();
  await expect(page.locator(".blog-content")).toBeVisible();
});

test("server-rendered navigation and content work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/blog/interactive-markdown-demo-test");
  await expect(page.locator(".blog-content")).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await page.getByRole("link", { name: "Read case study" }).first().click();
  await expect(page.locator(".blog-content")).toBeVisible();
  await expect(page.locator(".blog-content")).toHaveText(/\S/);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "I'm Fred Hong" })
  ).toBeVisible();
  await context.close();
});
