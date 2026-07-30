import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const hljs = require("highlight.js");

export const b64 = {
  enc(s: string) {
    return Buffer.from(s, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  },
  dec(s: string) {
    const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
    return Buffer.from(
      s.replace(/-/g, "+").replace(/_/g, "/") + pad,
      "base64"
    ).toString("utf8");
  },
};

export function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function hl(language: "html" | "javascript", source: string) {
  try {
    return hljs.highlight(source, { language }).value;
  } catch {
    try {
      return hljs.highlightAuto(source).value;
    } catch {
      return escapeHtml(source);
    }
  }
}

export async function runJsInVm(
  code: string,
  opts: { timeoutMs?: number; allowRequire?: boolean } = {}
) {
  const timeoutMs = opts.timeoutMs ?? 2000;
  const logs: string[] = [];
  const consoleShim = {
    log: (...values: unknown[]) => logs.push(stringify(values)),
    info: (...values: unknown[]) => logs.push(stringify(values)),
    warn: (...values: unknown[]) => logs.push(`[warn] ${stringify(values)}`),
    error: (...values: unknown[]) => logs.push(`[error] ${stringify(values)}`),
  };
  const sandbox: Record<string, unknown> = { console: consoleShim };
  if (opts.allowRequire) {
    const moduleRecord = { exports: {} };
    sandbox.require = require;
    sandbox.module = moduleRecord;
    sandbox.exports = moduleRecord.exports;
  }
  const context = vm.createContext(sandbox, { name: "js-run-ssg" });

  const asyncNeeded = /\bawait\b/.test(code);
  const wrapped = asyncNeeded
    ? `(async()=>{ ${code}\n})()`
    : `(function(){ ${code}\n})()`;

  let value: unknown;
  let error: string | undefined;
  try {
    const script = new vm.Script(wrapped, { filename: "snippet.js" });
    const result: unknown = script.runInContext(context, {
      timeout: timeoutMs,
    });
    if (isPromiseLike(result)) {
      value = await Promise.race([
        result,
        new Promise((_r, rej) =>
          setTimeout(
            () => rej(new Error(`Timed out after ${timeoutMs}ms`)),
            timeoutMs
          )
        ),
      ]);
    } else {
      value = result;
    }
  } catch (caught) {
    error = formatExecutionError(caught);
  }
  return { logs, value, error };
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  if (
    (typeof value !== "object" && typeof value !== "function") ||
    value === null
  ) {
    return false;
  }
  return typeof (value as { then?: unknown }).then === "function";
}

function formatExecutionError(caught: unknown): string {
  if (
    (typeof caught === "object" || typeof caught === "function") &&
    caught !== null
  ) {
    const errorLike = caught as { name?: unknown; message?: unknown };
    const name = typeof errorLike.name === "string" ? errorLike.name : "Error";
    const message =
      typeof errorLike.message === "string"
        ? errorLike.message
        : String(caught);
    return `${name}: ${message}`;
  }
  return String(caught);
}

function stringify(values: unknown[]) {
  return values
    .map((value) => {
      if (typeof value === "string") return value;
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    })
    .join(" ");
}
