import { expect, test } from "@playwright/test";

test("CV navigation, theme, research links, and print action work", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "CV", exact: true })
    .click();
  await expect(page).toHaveTitle("CV — Fred Hong");
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "CV", exact: true })
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("list", { name: "Work experience" }).locator(":scope > li")
  ).toHaveCount(6);
  const timeline = await page.locator(".timeline").boundingBox();
  const firstRole = await page
    .locator(".timeline article")
    .first()
    .boundingBox();
  expect(timeline).not.toBeNull();
  expect(firstRole).not.toBeNull();
  if (timeline && firstRole) {
    expect(firstRole.width).toBeGreaterThan(timeline.width * 0.8);
  }
  await expect(
    page.getByRole("heading", { name: "Lead Engineer", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Pediatric Consent on FHIR", exact: false })
  ).toHaveAttribute("href", /researchgate\.net\/publication\/379145083/);
  await expect(page.locator("#research")).toContainText(
    "Research contribution"
  );
  await expect(page.locator("#skills")).not.toContainText("OpenID Connect");

  const theme = page.getByRole("checkbox", { name: "Dark theme" });
  await theme.check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await theme.uncheck();

  await page.evaluate(() => {
    window.print = () => {
      Reflect.set(window, "__cvPrintRequested", true);
    };
  });
  const printButton = page.getByRole("button", { name: "Print / save PDF" });
  await expect(printButton).toBeEnabled();
  await printButton.click();
  expect(
    await page.evaluate(() => Reflect.get(window, "__cvPrintRequested"))
  ).toBe(true);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".site-header")).toBeHidden();
  await expect(printButton).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "Fred Hong", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Work experience", exact: true })
  ).toBeVisible();
});

test("the resume remains readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/cv");
  await expect(
    page.getByRole("heading", { name: "Fred Hong", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("list", { name: "Work experience" }).locator(":scope > li")
  ).toHaveCount(6);
  await expect(
    page.getByRole("heading", { name: "Technical skills", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Publications & research", exact: true })
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  await context.close();
});
