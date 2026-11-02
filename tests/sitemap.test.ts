import { expect, test } from "bun:test";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  utimes,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

test("sitemap lastmod uses route and Markdown file mtimes instead of publication or build dates", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "portfolio-sitemap-"));
  const pages = [
    ["/", "app/routes/index.tsx", "2024-01-02"],
    ["/blog", "app/routes/blog/index.tsx", "2024-02-03"],
    ["/projects", "app/routes/projects/index.tsx", "2024-03-04"],
    ["/cv", "app/routes/cv.tsx", "2024-04-05"],
    ["/blog/updated", "content/posts/updated.md", "2024-05-06"],
    ["/blog/undated", "content/posts/undated.md", "2024-06-07"],
    ["/projects/example", "content/projects/example.md", "2024-07-08"],
  ];

  try {
    for (const [, file, date] of pages) {
      const filePath = path.join(directory, file);
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, "---\ntitle: Example\ndraft: false\n---\n");
      const modified = new Date(`${date}T12:00:00Z`);
      await utimes(filePath, modified, modified);
    }
    await writeFile(
      path.join(directory, "content/projects/draft.md"),
      "---\ntitle: Draft\ndraft: true\n---\n"
    );
    await writeFile(
      path.join(directory, "content/posts/unlisted.md"),
      "---\ntitle: Unlisted\ndraft: true\n---\n"
    );
    await mkdir(path.join(directory, "public"));
    await writeFile(
      path.join(directory, "public/posts.json"),
      JSON.stringify([
        { slug: "updated", date: "2000-01-01" },
        { slug: "undated", date: null },
      ])
    );

    const result = Bun.spawnSync(
      [process.execPath, path.resolve("scripts/gen-sitemap.ts")],
      {
        cwd: directory,
        env: { ...process.env, VITE_SITE_URL: "https://example.com" },
      }
    );
    expect(result.exitCode, new TextDecoder().decode(result.stderr)).toBe(0);

    const sitemap = await readFile(
      path.join(directory, "public/sitemap.xml"),
      "utf8"
    );
    const entries = Object.fromEntries(
      Array.from(
        sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g),
        ([, url, lastmod]) => [url, lastmod]
      )
    );
    expect(entries).toEqual(
      Object.fromEntries(
        pages.map(([route, , date]) => [`https://example.com${route}`, date])
      )
    );
    expect(sitemap.match(/<url>/g)).toHaveLength(pages.length);
    expect(sitemap).not.toContain("/draft");
    expect(sitemap).not.toContain("/unlisted");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
