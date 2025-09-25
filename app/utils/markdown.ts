import { createRequire } from "node:module";
import MarkdownIt from "markdown-it";
import {
  htmlDemoPlugin,
  preprocessJsRun,
  katexPlugin,
} from "../markdown-plugins";

const require = createRequire(import.meta.url);
const hljs = require("highlight.js");

// Helper function to add line numbers to highlighted code
function addLineNumbers(code: string): string {
  return code
    .split("\n")
    .map((line) => `<span class="line">${line}</span>`)
    .join("\n");
}

// Create markdown-it instance with plugins
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value;
        return addLineNumbers(highlighted);
      } catch (__) {}
    }
    return addLineNumbers(str);
  },
});

// Apply plugins
htmlDemoPlugin(md);
katexPlugin(md);

// Override fence renderer to add line numbers class
const defaultFenceRenderer =
  md.renderer.rules.fence ||
  function (tokens, idx, options, env, renderer) {
    return renderer.renderToken(tokens, idx, options);
  };

md.renderer.rules.fence = function (tokens, idx, options, env, renderer) {
  const token = tokens[idx];
  const info = token.info ? token.info.trim() : "";
  const langName = info.split(/\s+/g)[0];

  // Check if this is a demo or run block (these are handled by plugins)
  if (info.includes("demo") || info.includes("run")) {
    return defaultFenceRenderer(tokens, idx, options, env, renderer);
  }

  // For regular code blocks, add line numbers
  const highlighted = options.highlight
    ? options.highlight(token.content, langName, "")
    : token.content;
  const langClass = langName ? ` language-${langName}` : "";

  return `<pre class="code-with-lines"><code class="hljs${langClass}">${highlighted}</code></pre>\n`;
};

/**
 * Process markdown content with custom plugins
 * - First preprocesses js run blocks (build-time execution)
 * - Then applies markdown-it with html demo plugin
 */
export async function processMarkdown(content: string): Promise<string> {
  // First, preprocess JS run blocks
  const preprocessed = await preprocessJsRun(content, {
    timeoutMs: 2000,
    allowRequire: false,
    badge: "js (built)",
  });

  // Then apply markdown-it with html demo plugin
  return md.render(preprocessed);
}
