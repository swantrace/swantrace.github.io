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

function findClosingFence(
  source: string,
  marker: string,
  from: number
): RegExpExecArray | null {
  const closingFence = new RegExp(
    `^ {0,3}${marker[0]}{${marker.length},}[\\t ]*(?:\\r?\\n|$)`,
    "gm"
  );
  closingFence.lastIndex = from;
  return closingFence.exec(source);
}

async function renderJsRun(
  code: string,
  badge: string,
  opt?: { timeoutMs?: number; allowRequire?: boolean }
): Promise<string> {
  const { logs, value, error } = await runJsInVm(code, {
    timeoutMs: opt?.timeoutMs ?? 2000,
    allowRequire: !!opt?.allowRequire,
  });
  const highlighted = hl("javascript", code);
  const src = b64.enc(code);
  const codeH = b64.enc(highlighted);
  const logsA = b64.enc(JSON.stringify(logs));
  const valA =
    typeof value === "undefined" ? "" : b64.enc(serializeValue(value));
  const errA = error ? b64.enc(JSON.stringify(error)) : "";
  const safeBadge = escapeHtml(badge);
  const fallbackOutput = renderFallbackOutput(logs, value, error);

  return `<div class="demo-component not-prose"><js-run src="${src}" code="${codeH}" logs="${logsA}"${
    valA ? ` value="${valA}"` : ""
  }${errA ? ` error="${errA}"` : ""} badge="${safeBadge}"><details class="demo-fallback not-prose" open><summary>${safeBadge} example</summary><pre><code class="hljs">${highlighted}</code></pre>${fallbackOutput}</details></js-run></div>\n`;
}

// Convert JavaScript run fences into build-time <js-run> output.
export async function preprocessJsRun(
  source: string,
  opt?: { timeoutMs?: number; allowRequire?: boolean; badge?: string }
) {
  const badge = opt?.badge ?? "js (built)";
  const openingFence = /^( {0,3})(`{3,}|~{3,})([^\r\n]*)(?:\r?\n|$)/gm;
  let out = "";
  let cursor = 0;
  openingFence.lastIndex = cursor;

  for (
    let opening = openingFence.exec(source);
    opening;
    opening = openingFence.exec(source)
  ) {
    const openingStart = opening.index;
    const contentStart = openingFence.lastIndex;
    const marker = opening[2];
    const infoRaw = opening[3].trim();
    const closing = findClosingFence(source, marker, contentStart);

    if (!closing) break;

    const closingEnd = closing.index + closing[0].length;
    const { lang, flags } = parseFenceInfo(infoRaw);
    const isJs = lang === "js" || lang === "javascript";
    const isRun = flags.has("run");

    if (!(isJs && isRun)) {
      openingFence.lastIndex = closingEnd;
      continue;
    }

    const code = source
      .slice(contentStart, closing.index)
      .replace(/\r?\n$/, "");
    out += source.slice(cursor, openingStart);
    out += await renderJsRun(code, badge, opt);
    cursor = closingEnd;
    openingFence.lastIndex = cursor;
  }

  out += source.slice(cursor);
  return out;
}
