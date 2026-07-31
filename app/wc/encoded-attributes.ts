export function decodeBase64Url(
  encoded: string | null | undefined,
  fallback = ""
): string {
  if (!encoded) return fallback;
  if (!/^[A-Za-z0-9_-]+$/.test(encoded) || encoded.length % 4 === 1) {
    return fallback;
  }

  try {
    const padding =
      encoded.length % 4 ? "=".repeat(4 - (encoded.length % 4)) : "";
    const binary = atob(
      encoded.replace(/-/g, "+").replace(/_/g, "/") + padding
    );
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0)
    );
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return fallback;
  }
}

export function decodeJsonAttribute<T>(
  encoded: string | null | undefined,
  fallback: T
): T {
  const decoded = decodeBase64Url(encoded);
  if (!decoded) return fallback;

  try {
    return JSON.parse(decoded) as T;
  } catch {
    return fallback;
  }
}
