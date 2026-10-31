import { expect, test } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { parseMarkdownFile } from "../app/utils/posts";

test("every blog post has readable YAML metadata", async () => {
  const files = (await readdir("content/posts")).filter((file) =>
    file.endsWith(".md")
  );
  expect(files.length).toBeGreaterThan(0);
  for (const file of files) {
    const parsed = await parseMarkdownFile(`content/posts/${file}`);
    expect(parsed, file).not.toBeNull();
    expect(parsed?.data.title, file).toBeString();
    expect(parsed?.data.tags, file).toBeArray();
    expect(parsed?.data.draft, file).toBeBoolean();
  }
});

test("Biome formatting preserves YAML frontmatter", async () => {
  const file =
    "content/posts/javascript-object-property-descriptors-and-reflection.md";
  const source = await readFile(file, "utf8");
  const result = Bun.spawnSync(
    [process.execPath, "run", "biome", "format", `--stdin-file-path=${file}`],
    { stdin: Bun.file(file) }
  );
  expect(result.exitCode, new TextDecoder().decode(result.stderr)).toBe(0);
  const formatted = new TextDecoder().decode(result.stdout);
  expect(formatted.split("\n---\n", 1)[0]).toBe(source.split("\n---\n", 1)[0]);
});
