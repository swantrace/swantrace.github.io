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
      class="border rounded-lg overflow-hidden my-4 bg-white dark:bg-gray-900"
    >
      <!-- Header with badge and controls -->
      <div
        class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b"
      >
        <span
          class="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide"
        >
          ${badge}
        </span>
        <div class="flex gap-2">
          <button
            @click=${copySource}
            class="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ${copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <!-- Code view -->
      <div class="border-b bg-gray-50 dark:bg-gray-800">
        <pre
          class="code-with-lines text-sm overflow-x-auto p-4 m-0"
        ><code class="hljs text-wrap" .innerHTML=${codeWithLines}></code></pre>
      </div>

      <!-- Output section -->
      ${hasOutput
        ? html`
            <div class="p-4 space-y-3">
              <!-- Console logs -->
              ${logs.length > 0
                ? html`
                    <div>
                      <h4
                        class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Console Output:
                      </h4>
                      <div
                        class="bg-black text-green-400 text-sm p-3 rounded font-mono overflow-x-auto"
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
                        class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Return Value:
                      </h4>
                      <div
                        class="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm p-3 rounded font-mono overflow-x-auto"
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
                        class="text-sm font-medium text-red-700 dark:text-red-300 mb-2"
                      >
                        Error:
                      </h4>
                      <div
                        class="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-sm p-3 rounded font-mono overflow-x-auto whitespace-pre-wrap"
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
