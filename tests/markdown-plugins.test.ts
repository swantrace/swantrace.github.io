import { describe, expect, test } from "bun:test";
import MarkdownIt from "markdown-it";
import { parseFenceInfo } from "../app/markdown-plugins/flags";
import { htmlDemoPlugin } from "../app/markdown-plugins/html-demo";
import { preprocessJsRun } from "../app/markdown-plugins/js-run";
import { b64 } from "../app/markdown-plugins/utils";
import { processMarkdown } from "../app/utils/markdown";
import {
  blockedDemoElements,
  shouldRemoveDemoAttribute,
} from "../app/wc/html-demo-safety";

function attribute(html: string, name: string): string | undefined {
  return html.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
}

function decodedAttribute(html: string, name: string): string | undefined {
  const value = attribute(html, name);
  return value === undefined ? undefined : b64.dec(value);
}

describe("fence flags", () => {
  test("parses plain and braced flags", () => {
    expect(parseFenceInfo("html demo")).toEqual({
      lang: "html",
      flags: new Set(["demo"]),
    });
    expect(parseFenceInfo("JavaScript {run}")).toEqual({
      lang: "javascript",
      flags: new Set(["run"]),
    });
  });
});

describe("HTML demo Markdown plugin", () => {
  test("converts an HTML demo fence and preserves its source", () => {
    const md = new MarkdownIt();
    htmlDemoPlugin(md);
    const source =
      '<form><label>Name <input name="name" required></label></form>';

    const html = md.render(`\`\`\`html demo\n${source}\n\`\`\``);

    expect(html).toContain("<html-demo ");
    expect(html).toContain('class="demo-fallback not-prose"');
    expect(html).toContain("<summary>html demo source</summary>");
    expect(html).not.toContain(source);
    expect(decodedAttribute(html, "src")).toBe(`${source}\n`);
    expect(attribute(html, "badge")).toBe("html");
  });

  test("accepts XML demo fences", () => {
    const md = new MarkdownIt();
    htmlDemoPlugin(md);

    expect(md.render("```xml {demo}\n<message>Hello</message>\n```")).toContain(
      "<html-demo "
    );
  });

  test("does not execute JavaScript while rendering the Markdown", () => {
    const md = new MarkdownIt();
    htmlDemoPlugin(md);
    const source = "<script>throw new Error('must not execute')</script>";
    const rendered = md.render(`\`\`\`html demo\n${source}\n\`\`\``);

    expect(rendered).toContain("<html-demo ");
    expect(rendered).not.toContain("<script>");
  });

  test("leaves an ordinary HTML fence as a code block", () => {
    const md = new MarkdownIt();
    htmlDemoPlugin(md);

    const html = md.render("```html\n<p>Hello</p>\n```");

    expect(html).toContain("<pre><code");
    expect(html).not.toContain("<html-demo ");
  });
});

describe("HTML demo safety policy", () => {
  test("blocks active and embedded document elements", () => {
    expect(blockedDemoElements).toContain("script");
    expect(blockedDemoElements).toContain("iframe");
    expect(blockedDemoElements).toContain("object");
  });

  test("removes event handlers, srcdoc, and executable URLs", () => {
    expect(shouldRemoveDemoAttribute("onclick", "save()")).toBeTrue();
    expect(shouldRemoveDemoAttribute("srcdoc", "<script></script>")).toBeTrue();
    expect(
      shouldRemoveDemoAttribute("href", " java\nscript:alert(1)")
    ).toBeTrue();
    expect(
      shouldRemoveDemoAttribute("href", "https://example.com")
    ).toBeFalse();
    expect(shouldRemoveDemoAttribute("aria-label", "Save")).toBeFalse();
  });
});

describe("JS run Markdown preprocessor", () => {
  test("captures console output and a returned value", async () => {
    const markdown = [
      "```js run",
      'console.log("answer", 42);',
      "return 42;",
      "```",
    ].join("\n");

    const html = await preprocessJsRun(markdown);

    expect(html).toContain("<js-run ");
    expect(html).toContain('class="demo-fallback not-prose"');
    expect(html).toContain("Console Output:");
    expect(html).toContain("Return Value:");
    expect(html).toContain("answer 42");
    expect(JSON.parse(decodedAttribute(html, "logs") ?? "")).toEqual([
      "answer 42",
    ]);
    expect(JSON.parse(decodedAttribute(html, "value") ?? "")).toBe(42);
  });

  test("captures runtime errors", async () => {
    const html = await preprocessJsRun(
      "```javascript {run}\nthrow new Error('broken');\n```"
    );
    const error = JSON.parse(decodedAttribute(html, "error") ?? "");

    expect(error).toContain("Error: broken");
    expect(html).toContain('class="demo-fallback not-prose"');
    expect(html).toContain("Error:");
    expect(html).toContain("Error: broken");
  });

  test("supports awaited snippets", async () => {
    const html = await preprocessJsRun(
      "```js run\nawait Promise.resolve();\nreturn 'ready';\n```"
    );

    expect(JSON.parse(decodedAttribute(html, "value") ?? "")).toBe("ready");
  });

  test("stops synchronous snippets that exceed the timeout", async () => {
    const html = await preprocessJsRun("```js run\nwhile (true) {}\n```", {
      timeoutMs: 20,
    });
    const error = JSON.parse(decodedAttribute(html, "error") ?? "");

    expect(error).toContain("Script execution timed out");
  });

  test("leaves ordinary JavaScript and HTML demo fences unchanged", async () => {
    const javascript = "```js\nconsole.log('not executed');\n```";
    const htmlDemo = "```html demo\n<button>Save</button>\n```";

    expect(await preprocessJsRun(javascript)).toBe(javascript);
    expect(await preprocessJsRun(htmlDemo)).toBe(htmlDemo);
  });
});

describe("Markdown pipeline", () => {
  test("routes demo fences without changing ordinary code fences", async () => {
    const output = await processMarkdown(
      [
        "```html demo",
        "<button>Save</button>",
        "```",
        "",
        "```ts",
        "const saved = true;",
        "```",
      ].join("\n")
    );

    expect(output).toContain("<html-demo ");
    expect(output).toContain('<pre class="code-with-lines not-prose">');
    expect(output).toContain("language-ts");
    expect(output).not.toContain("<js-run ");
  });
});
