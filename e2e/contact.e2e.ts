import { expect, test } from "@playwright/test";

test("contact dialog supports validation, Escape, and focus restoration", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", {
    name: "Let's connect",
    exact: true,
  });
  await expect(trigger).toBeVisible();
  await page.locator("contact-form").evaluate((element) => {
    element.removeAttribute("service-id");
    element.removeAttribute("template-id");
    element.removeAttribute("public-key");
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Let's connect",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Name", { exact: true })).toBeFocused();
  await dialog
    .getByRole("button", { name: "Open email app", exact: true })
    .click();
  expect(
    await dialog
      .locator("form input[name=name]")
      .evaluate((input: HTMLInputElement) => input.validity.valueMissing)
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog
    .getByRole("button", { name: "Close contact form", exact: true })
    .click();
  await expect(dialog).toBeHidden();
});

test("direct submission retains failed messages and confirms only accepted submissions", async ({
  page,
}) => {
  const endpoint = "https://api.emailjs.com/api/v1.0/email/send";
  let requests = 0;
  const bodies: string[] = [];
  await page.route(endpoint, async (route) => {
    requests++;
    bodies.push(route.request().postData() || "");
    await route.fulfill({
      status: requests === 1 ? 503 : 200,
      contentType: "text/plain",
      body: requests === 1 ? "Unavailable" : "OK",
    });
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Let's connect", exact: true })
  ).toBeVisible();
  await page.locator("contact-form").evaluate((element) => {
    element.setAttribute("service-id", "service_test");
    element.setAttribute("template-id", "template_test");
    element.setAttribute("public-key", "public_test");
  });
  await page
    .getByRole("button", { name: "Let's connect", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Let's connect",
    exact: true,
  });
  await dialog.getByLabel("Name", { exact: true }).fill("Alex Example");
  await dialog.getByLabel("Email", { exact: true }).fill("alex@example.com");
  await dialog
    .getByLabel("Message", { exact: true })
    .fill("A fictional test enquiry.");
  await dialog
    .getByRole("button", { name: "Send message", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Couldn't confirm your submission"
  );
  await expect(dialog.getByLabel("Message", { exact: true })).toHaveValue(
    "A fictional test enquiry."
  );
  await expect(
    dialog.getByText("Thanks! Your message has been submitted.", {
      exact: true,
    })
  ).toHaveCount(0);
  await dialog
    .getByRole("button", { name: "Send message", exact: true })
    .click();
  await expect(dialog.getByRole("status")).toHaveText(
    "Thanks! Your message has been submitted."
  );
  await expect(dialog.getByLabel("Message", { exact: true })).toHaveValue("");
  expect(requests).toBe(2);
  expect(JSON.parse(bodies[1])).toEqual({
    service_id: "service_test",
    template_id: "template_test",
    user_id: "public_test",
    template_params: {
      from_name: "Alex Example",
      from_email: "alex@example.com",
      reply_to: "alex@example.com",
      message: "A fictional test enquiry.",
    },
  });
});

test("contact falls back to email without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Let's connect by email", exact: true })
  ).toHaveAttribute("href", "mailto:frederickhong.5@gmail.com");
  await context.close();
});
