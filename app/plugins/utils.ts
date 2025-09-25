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
    log: (...a: any[]) => logs.push(stringify(a)),
    info: (...a: any[]) => logs.push(stringify(a)),
    warn: (...a: any[]) => logs.push("[warn] " + stringify(a)),
    error: (...a: any[]) => logs.push("[error] " + stringify(a)),
  };
  const sandbox: any = { console: consoleShim };
  if (opts.allowRequire) {
    sandbox.require = require;
    sandbox.module = { exports: {} };
    sandbox.exports = sandbox.module.exports;
  }
  const context = vm.createContext(sandbox, { name: "js-run-ssg" });

  const asyncNeeded = /\bawait\b/.test(code);
  const wrapped = asyncNeeded
    ? `(async()=>{ ${code}\n})()`
    : `(function(){ ${code}\n})()`;

  const script = new vm.Script(wrapped, { filename: "snippet.js" });

  let value: any = undefined,
    error: string | undefined;
  try {
    const result = script.runInContext(context, { timeout: timeoutMs });
    if (result && typeof result.then === "function") {
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
  } catch (e: any) {
    error = String(e && (e.stack || e.message) ? e.stack || e.message : e);
  }
  return { logs, value, error };
}

function stringify(a: any[]) {
  return a
    .map((x) => {
      if (typeof x === "string") return x;
      try {
        return JSON.stringify(x);
      } catch {
        return String(x);
      }
    })
    .join(" ");
}
