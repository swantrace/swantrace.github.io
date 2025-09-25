export type FenceInfo = { lang: string; flags: Set<string> };

// Examples: "js run", "html demo", "javascript {run}"
export function parseFenceInfo(infoRaw: string): FenceInfo {
  const info = (infoRaw || "").trim();
  if (!info) return { lang: "", flags: new Set() };

  // Split lang from subsequent flags
  const parts = info.split(/\s+/);
  const lang = (parts.shift() || "").toLowerCase();

  // Support {run} style syntax
  const flags: string[] = parts.flatMap((p) => {
    const m = p.match(/^\{(.+)\}$/);
    return m ? m[1].split(",") : [p];
  });
  return { lang, flags: new Set(flags.map((s) => s.toLowerCase())) };
}
