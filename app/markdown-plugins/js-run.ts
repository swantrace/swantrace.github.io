import { parseFenceInfo } from "./flags";
import { b64, escapeHtml, hl, runJsInVm } from "./utils";

function formatValue(value: unknown): string {
  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}

function serializeValue(value: unknown): string {
  try {
    return JSON.stringify(value) ?? JSON.stringify(String(value));
  } catch {
    return JSON.stringify(String(value));
  }
}

function renderFallbackOutput(
  logs: string[],
  value: unknown,
  error: string | undefined
): string {
  const sections: string[] = [];

  if (logs.length > 0) {
    sections.push(
      `<section><h4>Console Output:</h4><pre>${escapeHtml(logs.join("\n"))}</pre></section>`
    );
  }

  if (value !== undefined) {
    sections.push(
      `<section><h4>Return Value:</h4><pre>${escapeHtml(formatValue(value))}</pre></section>`
    );
  }

  if (error) {
    sections.push(
      `<section><h4>Error:</h4><pre>${escapeHtml(error)}</pre></section>`
    );
  }

  return sections.length > 0
    ? `<div class="demo-fallback-output">${sections.join("")}</div>`
    : "";
}

// Preprocess string: convert ```js run …``` → <js-run …>
export async function preprocessJsRun(
  source: string,
  opt?: { timeoutMs?: number; allowRequire?: boolean; badge?: string }
) {
  const badge = opt?.badge ?? "js (built)";

  // Coarse-grained scan of all fences, then check if info contains "js run"
  // Match triple backtick fences (not handling ~~~ for now)
  const fenceRe = /```([^\n]+?)\n([\s\S]*?)\n```/g;

  let out = "";
  let last = 0;
  for (const m of source.matchAll(fenceRe)) {
    out += source.slice(last, m.index);
    last = (m.index ?? 0) + m[0].length;

    const infoRaw = m[1]; // e.g. "js run" / "javascript {run}"
    const code = m[2] || "";

    const { lang, flags } = parseFenceInfo(infoRaw);
    const isJs = lang === "js" || lang === "javascript";
    const isRun = flags.has("run");

    if (!(isJs && isRun)) {
      // Not js run → put back as-is
      out += m[0];
      continue;
    }

    // —— Build-time execution —— //
    const { logs, value, error } = await runJsInVm(code, {
      timeoutMs: opt?.timeoutMs ?? 2000,
      allowRequire: !!opt?.allowRequire,
    });

    // Generate attributes
    const highlighted = hl("javascript", code);
    const src = b64.enc(code);
    const codeH = b64.enc(highlighted);
    const logsA = b64.enc(JSON.stringify(logs));
    const valA =
      typeof value === "undefined" ? "" : b64.enc(serializeValue(value));
    const errA = error ? b64.enc(JSON.stringify(error)) : "";
    const safeBadge = escapeHtml(badge);
    const fallbackOutput = renderFallbackOutput(logs, value, error);

    // Output custom element for frontend component to render
    out += `<js-run src="${src}" code="${codeH}" logs="${logsA}"${
      valA ? ` value="${valA}"` : ""
    }${errA ? ` error="${errA}"` : ""} badge="${safeBadge}"><details class="demo-fallback not-prose" open><summary>${safeBadge} example</summary><pre><code class="hljs">${highlighted}</code></pre>${fallbackOutput}</details></js-run>\n`;
  }

  out += source.slice(last);
  return out;
}
