import type MarkdownIt from "markdown-it";
import { parseFenceInfo } from "./flags";
import { b64, escapeHtml, hl } from "./utils";

export function htmlDemoPlugin(
  md: MarkdownIt,
  opts?: { flag?: string; badge?: string }
) {
  const flag = (opts?.flag ?? "demo").toLowerCase(); // Use ```html demo to trigger
  const badge = opts?.badge ?? "html";

  const baseFence =
    md.renderer.rules.fence ?? ((t, i, o, _e, s) => s.renderToken(t, i, o));
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = parseFenceInfo(token.info || "");

    if (info.lang !== "html" && info.lang !== "xml")
      return baseFence(tokens, idx, options, env, self);
    if (!info.flags.has(flag))
      return baseFence(tokens, idx, options, env, self);

    const raw = token.content || "";
    const highlighted = hl("html", raw);

    const srcAttr = b64.enc(raw);
    const codeAttr = b64.enc(highlighted);
    const safeBadge = escapeHtml(badge);

    return `<html-demo src="${srcAttr}" code="${codeAttr}" badge="${safeBadge}"><details class="demo-fallback not-prose" open><summary>${safeBadge} demo source</summary><pre><code class="hljs">${highlighted}</code></pre></details></html-demo>\n`;
  };
}
