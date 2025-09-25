import { b64, hl, runJsInVm } from "./utils";
import { parseFenceInfo } from "./flags";

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
  let m: RegExpExecArray | null;

  while ((m = fenceRe.exec(source)) !== null) {
    out += source.slice(last, m.index);
    last = fenceRe.lastIndex;

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
    const src = b64.enc(code);
    const codeH = b64.enc(hl("javascript", code));
    const logsA = b64.enc(JSON.stringify(logs));
    const valA =
      typeof value === "undefined" ? "" : b64.enc(JSON.stringify(value));
    const errA = error ? b64.enc(JSON.stringify(error)) : "";

    // Output custom element for frontend component to render
    out += `<js-run src="${src}" code="${codeH}" logs="${logsA}"${
      valA ? ` value="${valA}"` : ""
    }${errA ? ` error="${errA}"` : ""} badge="${badge}"></js-run>\n`;
  }

  out += source.slice(last);
  return out;
}
