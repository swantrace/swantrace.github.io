import { html, component, useState } from "haunted";

// Utility to decode base64 attributes
function b64dec(s: string): string {
  if (!s) return "";
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  // Use atob for browser compatibility
  const decoded = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return decodeURIComponent(escape(decoded));
}

// Custom element: <js-run src="base64" code="base64" logs="base64" value="base64" error="base64" badge="js"></js-run>
function JsRun(this: HTMLElement) {
  const [copied, setCopied] = useState(false);

  const srcAttr = this.getAttribute("src") ?? "";
  const codeAttr = this.getAttribute("code") ?? "";
  const logsAttr = this.getAttribute("logs") ?? "";
  const valueAttr = this.getAttribute("value") ?? "";
  const errorAttr = this.getAttribute("error") ?? "";
  const badge = this.getAttribute("badge") ?? "js";

  const sourceCode = srcAttr ? b64dec(srcAttr) : "";
  const highlightedCode = codeAttr ? b64dec(codeAttr) : "";
  const logs = logsAttr ? JSON.parse(b64dec(logsAttr)) : [];
  const value = valueAttr ? JSON.parse(b64dec(valueAttr)) : undefined;
  const error = errorAttr ? JSON.parse(b64dec(errorAttr)) : null;

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

  const hasOutput = logs.length > 0 || value !== undefined || error;

  return html`
    <div
      class="my-4 overflow-hidden rounded-lg border bg-white dark:bg-gray-900"
    >
      <!-- Header with badge and controls -->
      <div
        class="flex items-center justify-between border-b bg-gray-50 px-4 py-2 dark:bg-gray-800"
      >
        <span
          class="text-xs font-medium tracking-wide text-gray-600 uppercase dark:text-gray-300"
        >
          ${badge}
        </span>
        <div class="flex gap-2">
          <button
            @click=${copySource}
            class="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            ${copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <!-- Code view -->
      <div class="border-b bg-gray-50 dark:bg-gray-800">
        <pre
          class="code-with-lines m-0 overflow-x-auto p-4 text-sm"
        ><code class="hljs text-wrap" .innerHTML=${codeWithLines}></code></pre>
      </div>

      <!-- Output section -->
      ${hasOutput
        ? html`
            <div class="space-y-3 p-4">
              <!-- Console logs -->
              ${logs.length > 0
                ? html`
                    <div>
                      <h4
                        class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Console Output:
                      </h4>
                      <div
                        class="overflow-x-auto rounded bg-black p-3 font-mono text-sm text-green-400"
                      >
                        ${logs.map((log: string) => html`<div>${log}</div>`)}
                      </div>
                    </div>
                  `
                : ""}

              <!-- Return value -->
              ${value !== undefined
                ? html`
                    <div>
                      <h4
                        class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Return Value:
                      </h4>
                      <div
                        class="overflow-x-auto rounded bg-blue-50 p-3 font-mono text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200"
                      >
                        ${typeof value === "string"
                          ? value
                          : JSON.stringify(value, null, 2)}
                      </div>
                    </div>
                  `
                : ""}

              <!-- Error -->
              ${error
                ? html`
                    <div>
                      <h4
                        class="mb-2 text-sm font-medium text-red-700 dark:text-red-300"
                      >
                        Error:
                      </h4>
                      <div
                        class="overflow-x-auto rounded bg-red-50 p-3 font-mono text-sm whitespace-pre-wrap text-red-800 dark:bg-red-900/20 dark:text-red-200"
                      >
                        ${error}
                      </div>
                    </div>
                  `
                : ""}
            </div>
          `
        : ""}
    </div>
  `;
}

if (!customElements.get("js-run")) {
  customElements.define(
    "js-run",
    component(JsRun, {
      useShadowDOM: false,
    })
  );
}

export {};
