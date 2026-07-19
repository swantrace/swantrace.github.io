import { component, html, useState } from "haunted";

// Utility to decode base64 attributes
function b64dec(s: string): string {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  // Use atob for browser compatibility
  const decoded = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return decodeURIComponent(escape(decoded));
}

// Custom element: <html-demo src="base64" code="base64" badge="html"></html-demo>
function HtmlDemo(this: HTMLElement) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const srcAttr = this.getAttribute("src") ?? "";
  const codeAttr = this.getAttribute("code") ?? "";
  const badge = this.getAttribute("badge") ?? "html";

  const sourceCode = srcAttr ? b64dec(srcAttr) : "";
  const highlightedCode = codeAttr ? b64dec(codeAttr) : "";

  // Add line numbers to highlighted code
  const codeWithLines = highlightedCode
    .split("\n")
    .map((line) => `<span class="line">${line}</span>`)
    .join("\n");

  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail
    }
  };

  const toggleCode = () => {
    setShowCode(!showCode);
  };

  return html`
    <div
      class="my-4 overflow-hidden rounded-lg border bg-white dark:bg-gray-900"
    >
      <!-- Header with badge and controls -->
      <div
        class="flex items-center justify-between border-b border-b-gray-800 bg-gray-50 px-4 py-2 dark:bg-gray-800"
      >
        <span
          class="text-xs font-medium tracking-wide text-gray-600 uppercase dark:text-gray-300"
        >
          ${badge}
        </span>
        <div class="flex gap-2">
          ${
            showCode
              ? html`
                <button
                  @click=${copySource}
                  class="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                >
                  ${copied ? "Copied!" : "Copy"}
                </button>
              `
              : ""
          }
          <button
            @click=${toggleCode}
            class="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            ${showCode ? "Hide Code" : "Show Code"}
          </button>
        </div>
      </div>

      <!-- Demo preview -->
      <div
        class="not-prose bg-gray-50 p-4 dark:bg-gray-800"
        .innerHTML=${sourceCode}
      ></div>

      <!-- Code view -->
      ${
        showCode
          ? html`
            <pre
              class="code-with-lines not-prose"
            ><code class="hljs" .innerHTML=${codeWithLines}></code></pre>
          `
          : ""
      }
    </div>
  `;
}

if (!customElements.get("html-demo")) {
  customElements.define(
    "html-demo",
    component(HtmlDemo, {
      useShadowDOM: false,
    })
  );
}
