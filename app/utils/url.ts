/** 构建期注入的前缀，如 "/" 或 "/your-repo/" */
export const BASE = import.meta.env.BASE_URL;

/** 相对 URL：用于 <link>、<script>、站内 <a>。 */
export function url(path: string): string {
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE}${p}`;
}

/** 绝对 URL：用于浏览器端 fetch 需要绝对地址的场景 */
export function urlAbs(path: string): string {
  const p = path.startsWith("/") ? path.slice(1) : path;
  if (typeof window !== "undefined") {
    const baseAbs = (window.location.origin + BASE).replace(/\/+$/, "");
    return `${baseAbs}/${p}`;
  }
  // Node/Bun（如生成 sitemap 脚本）：
  const site = (process.env.VITE_SITE_URL ?? "").replace(/\/+$/, "");
  if (!site) {
    // 兜底：常见本地 preview 的默认地址
    return `http://localhost:4173/${p}`;
  }
  return `${site}/${p}`;
}
