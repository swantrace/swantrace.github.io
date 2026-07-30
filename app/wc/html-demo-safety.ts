export const blockedDemoElements = [
  "base",
  "embed",
  "iframe",
  "link",
  "meta",
  "object",
  "script",
] as const;

const urlAttributes = new Set([
  "action",
  "formaction",
  "href",
  "src",
  "xlink:href",
]);

function isExecutableUrl(value: string): boolean {
  const compactValue = [...value]
    .filter((character) => character.charCodeAt(0) > 32)
    .join("");
  return /^(?:javascript|vbscript):/i.test(compactValue);
}

export function shouldRemoveDemoAttribute(
  name: string,
  value: string
): boolean {
  const normalizedName = name.toLowerCase();
  return (
    normalizedName.startsWith("on") ||
    normalizedName === "srcdoc" ||
    (urlAttributes.has(normalizedName) && isExecutableUrl(value))
  );
}
