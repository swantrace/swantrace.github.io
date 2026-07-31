import { expect, test } from "@playwright/test";

const demoPath = "/blog/interactive-markdown-demo-test";

test.beforeEach(async ({ page }) => {
  await page.goto(demoPath);
  await page.evaluate(async () => {
    await Promise.all([
      customElements.whenDefined("copy-button"),
      customElements.whenDefined("html-demo"),
      customElements.whenDefined("js-run"),
    ]);
  });
});

test("upgrades fallbacks and exposes styled shadow parts", async ({ page }) => {
  const htmlDemo = page.locator("html-demo").first();
  const jsRun = page.locator("js-run").first();

  await expect(
    htmlDemo.getByRole("region", { name: "HTML demo preview" })
  ).toBeVisible();
  await expect(
    jsRun.getByRole("region", { name: "JavaScript build output" })
  ).toBeVisible();
  await expect(htmlDemo.locator(":scope > .demo-fallback")).toBeHidden();
  await expect(jsRun.locator(":scope > .demo-fallback")).toBeHidden();

  const radii = await page.evaluate(() => {
    const htmlFrame = document
      .querySelector("html-demo")
      ?.shadowRoot?.querySelector<HTMLElement>('[part~="frame"]');
    const jsFrame = document
      .querySelector("js-run")
      ?.shadowRoot?.querySelector<HTMLElement>('[part~="frame"]');

    return {
      html: htmlFrame ? getComputedStyle(htmlFrame).borderRadius : "",
      js: jsFrame ? getComputedStyle(jsFrame).borderRadius : "",
    };
  });

  expect(radii.html).not.toBe("0px");
  expect(radii.js).not.toBe("0px");
});

test("applies dark theme variables across shadow boundaries", async ({
  page,
}) => {
  const readSurfaces = () =>
    page.evaluate(() => {
      const htmlFrame = document
        .querySelector("html-demo")
        ?.shadowRoot?.querySelector<HTMLElement>('[part~="frame"]');
      const jsFrame = document
        .querySelector("js-run")
        ?.shadowRoot?.querySelector<HTMLElement>('[part~="frame"]');
      return {
        html: htmlFrame ? getComputedStyle(htmlFrame).backgroundColor : "",
        js: jsFrame ? getComputedStyle(jsFrame).backgroundColor : "",
      };
    });

  const light = await readSurfaces();
  await page.evaluate(() => {
    document.documentElement.dataset.theme = "dark";
  });
  const dark = await readSurfaces();

  expect(dark.html).not.toBe(light.html);
  expect(dark.js).not.toBe(light.js);
});

test("copies the standalone value after an attribute update", async ({
  page,
}) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          Reflect.set(globalThis, "__standaloneCopiedText", text);
        },
      },
    });
  });

  const copyButton = page.locator("copy-button");
  await copyButton.evaluate((element) => {
    element.setAttribute("text", "bun run test:e2e");
  });
  await copyButton.getByRole("button", { name: "Copy to clipboard" }).click();
  await expect(
    copyButton.getByRole("button", { name: "Copied to clipboard" })
  ).toBeVisible();
  expect(
    await page.evaluate(() => Reflect.get(globalThis, "__standaloneCopiedText"))
  ).toBe("bun run test:e2e");
});

test("isolates HTML styles, sanitizes active content, and keeps validation", async ({
  page,
}) => {
  const htmlDemo = page.locator("html-demo").first();
  const preview = htmlDemo.getByRole("region", { name: "HTML demo preview" });

  await expect(
    preview.getByRole("heading", { name: "Request a demo" })
  ).toBeVisible();
  await expect(
    htmlDemo.getByRole("button", { name: "Show Code" })
  ).toBeVisible();

  const currentUrl = page.url();
  await preview.getByRole("button", { name: "Submit" }).click();
  await expect(preview.locator("#demo-name")).toBeFocused();
  expect(page.url()).toBe(currentUrl);

  await preview.locator("#demo-name").fill("Fred");
  await preview.locator("#demo-email").fill("fred@example.com");
  await preview.getByRole("button", { name: "Submit" }).click();
  expect(page.url()).toBe(currentUrl);

  await htmlDemo.evaluate((element) => {
    const source = [
      '<button onclick="globalThis.demoExecuted = true">Unsafe</button>',
      "<script>globalThis.demoExecuted = true</script>",
      '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
    ].join("");
    const bytes = new TextEncoder().encode(source);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const encoded = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    element.setAttribute("src", encoded);
  });

  const sanitized = await htmlDemo.evaluate((element) => {
    const previewElement =
      element.shadowRoot?.querySelector("html-demo-preview");
    const root = previewElement?.shadowRoot;
    const button = root?.querySelector("button");
    return {
      hasScript: Boolean(root?.querySelector("script")),
      hasIframe: Boolean(root?.querySelector("iframe")),
      hasHandler: button?.hasAttribute("onclick") ?? true,
      executed: "demoExecuted" in globalThis,
    };
  });

  expect(sanitized).toEqual({
    hasScript: false,
    hasIframe: false,
    hasHandler: false,
    executed: false,
  });
});

test("toggles and copies HTML source with accessible feedback", async ({
  page,
}) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          Reflect.set(globalThis, "__copiedText", text);
        },
      },
    });
  });

  const htmlDemo = page.locator("html-demo").first();
  await htmlDemo.getByRole("button", { name: "Show Code" }).click();
  await expect(
    htmlDemo.getByRole("button", { name: "Copy HTML source" })
  ).toBeVisible();
  await expect(htmlDemo.getByLabel("HTML demo source code")).toContainText(
    "Request a demo"
  );

  await htmlDemo.getByRole("button", { name: "Copy HTML source" }).click();
  await expect(
    htmlDemo.getByRole("button", {
      name: "HTML source copied to clipboard",
    })
  ).toBeVisible();

  const copied = await page.evaluate(() =>
    Reflect.get(globalThis, "__copiedText")
  );
  expect(copied).toContain("<form");

  await htmlDemo.getByRole("button", { name: "Hide Code" }).click();
  await expect(htmlDemo.getByLabel("HTML demo source code")).toBeHidden();
});

test("shows JS logs, compact return values, errors, and copy failures", async ({
  page,
}) => {
  const runs = page.locator("js-run");
  const firstRun = runs.nth(0);
  const errorRun = runs.nth(2);

  await expect(
    firstRun.getByRole("log", { name: "Console output" })
  ).toContainText("average");
  const returnValue = firstRun.getByRole("region", { name: "Return value" });
  await expect(returnValue).toContainText('"count": 3');
  expect(await returnValue.textContent()).toMatch(/^\{/);
  await expect(errorRun.getByRole("alert")).toContainText(
    "Intentional demo error"
  );

  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("clipboard unavailable");
        },
      },
    });
  });

  await firstRun
    .getByRole("button", { name: "Copy JavaScript source" })
    .click();
  await expect(
    firstRun.getByRole("button", {
      name: "JavaScript source could not be copied",
    })
  ).toBeVisible();
});

test("keeps static content usable when JavaScript is disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto(demoPath);
  await expect(
    page.locator("html-demo > .demo-fallback").first()
  ).toBeVisible();
  await expect(page.locator("js-run > .demo-fallback").first()).toBeVisible();
  await expect(page.locator("html-demo script")).toHaveCount(0);
  await expect(page.locator("js-run").first()).toContainText("Console Output:");
  await expect(page.locator("copy-button")).toContainText("Copy unavailable");
  await expect(page.locator("copy-button > button")).toBeDisabled();

  await context.close();
});
