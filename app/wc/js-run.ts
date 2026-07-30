import { component, html, useState } from "haunted";
import { decodeBase64Url, decodeJsonAttribute } from "./encoded-attributes";

function JsRun(this: HTMLElement) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  const sourceCode = decodeBase64Url(this.getAttribute("src"));
  const highlightedCode = decodeBase64Url(this.getAttribute("code"));
  const logs = decodeJsonAttribute<string[]>(this.getAttribute("logs"), []);
  const value = decodeJsonAttribute<unknown>(
    this.getAttribute("value"),
    undefined
  );
  const error = decodeJsonAttribute<string | null>(
    this.getAttribute("error"),
    null
  );
  const badge = this.getAttribute("badge") ?? "js";
  const codeWithLines = highlightedCode
    .split("\n")
    .map((line) => `<span class="line">${line}</span>`)
    .join("\n");

  const copySource = async () => {
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const hasOutput = logs.length > 0 || value !== undefined || Boolean(error);
  const formattedValue =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);

  return html`
    <style>
      :host {
        display: block;
        color: var(--js-run-color, #111827);
        font-family: var(--js-run-font-family, sans-serif);
      }

      .frame {
        overflow: hidden;
        border: 1px solid var(--js-run-border, #e5e7eb);
        background: var(--js-run-surface, #fff);
      }

      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        border-bottom: 1px solid var(--js-run-border, #e5e7eb);
        background: var(--js-run-toolbar, #f9fafb);
        padding: 0.5rem 1rem;
      }

      .badge {
        color: var(--js-run-muted, #4b5563);
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      button {
        border: 0;
        background: transparent;
        color: var(--js-run-muted, #4b5563);
        cursor: pointer;
        font: inherit;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
      }

      button:hover {
        background: var(--js-run-control-hover, #e5e7eb);
        color: var(--js-run-color, #111827);
      }

      button:focus-visible {
        outline: 2px solid var(--js-run-focus, #2563eb);
        outline-offset: 2px;
      }

      pre {
        counter-reset: line-number;
        margin: 0;
        overflow-x: auto;
        background: var(--js-run-code-surface, #f6f8fa);
        color: var(--js-run-code-color, #24292e);
      }

      code {
        display: block;
        min-width: max-content;
        padding: 1rem 1rem 1rem 3.5rem;
        font-family: var(--js-run-mono-font, monospace);
        font-size: 0.875rem;
        line-height: 1.625;
      }

      .line {
        counter-increment: line-number;
        position: relative;
      }

      .line::before {
        content: counter(line-number);
        display: inline-block;
        width: 1.5rem;
        margin-left: -2.5rem;
        margin-right: 1rem;
        color: var(--js-run-line-number, #6b7280);
        font-size: 0.75rem;
        text-align: right;
        user-select: none;
      }

      .hljs-comment,
      .hljs-quote {
        color: var(--js-run-syntax-comment, #6a737d);
      }

      .hljs-keyword,
      .hljs-selector-tag,
      .hljs-literal {
        color: var(--js-run-syntax-keyword, #d73a49);
      }

      .hljs-string,
      .hljs-regexp {
        color: var(--js-run-syntax-string, #032f62);
      }

      .hljs-title,
      .hljs-function,
      .hljs-attr {
        color: var(--js-run-syntax-title, #6f42c1);
      }

      .hljs-number,
      .hljs-variable,
      .hljs-built_in {
        color: var(--js-run-syntax-number, #005cc5);
      }

      .output {
        display: grid;
        gap: 1rem;
        padding: 1rem;
      }

      .output-group {
        min-width: 0;
      }

      h4 {
        margin: 0 0 0.5rem;
        color: var(--js-run-heading, #374151);
        font-size: 0.875rem;
        font-weight: 500;
      }

      .result {
        overflow-x: auto;
        border-radius: 0.25rem;
        padding: 0.75rem;
        font-family: var(--js-run-mono-font, monospace);
        font-size: 0.875rem;
      }

      .console {
        background: #000;
        color: #4ade80;
      }

      .return-value {
        background: var(--js-run-return-surface, #eff6ff);
        color: var(--js-run-return-color, #1e40af);
        white-space: pre-wrap;
      }

      .error {
        background: var(--js-run-error-surface, #fef2f2);
        color: var(--js-run-error-color, #991b1b);
        white-space: pre-wrap;
      }
    </style>

    <div class="frame" part="frame">
      <div class="toolbar" part="toolbar">
        <span class="badge" part="badge">${badge}</span>
        <div part="actions">
          <button
            type="button"
            part="control copy-button"
            @click=${copySource}
            aria-label=${
              copyStatus === "copied"
                ? "JavaScript source copied to clipboard"
                : copyStatus === "error"
                  ? "JavaScript source could not be copied"
                  : "Copy JavaScript source"
            }
          >
            <span aria-live="polite">
              ${
                copyStatus === "copied"
                  ? "Copied!"
                  : copyStatus === "error"
                    ? "Copy failed"
                    : "Copy"
              }
            </span>
          </button>
        </div>
      </div>

      <pre
        part="code"
        tabindex="0"
        aria-label="JavaScript source code"
      ><code
        part="code-content"
        .innerHTML=${codeWithLines}
      ></code></pre>

      ${
        hasOutput
          ? html`
            <div
              class="output"
              part="output"
              role="region"
              aria-label="JavaScript build output"
            >
              ${
                logs.length > 0
                  ? html`
                    <section class="output-group" part="output-group console-group">
                      <h4 part="output-heading">Console Output:</h4>
                      <div
                        class="result console"
                        part="console-output"
                        role="log"
                        aria-label="Console output"
                      >
                        ${logs.map(
                          (log) => html`<div part="console-line">${log}</div>`
                        )}
                      </div>
                    </section>
                  `
                  : ""
              }

              ${
                value !== undefined
                  ? html`
                    <section class="output-group" part="output-group return-group">
                      <h4 part="output-heading">Return Value:</h4>
                      <div
                        class="result return-value"
                        part="return-output"
                        role="region"
                        aria-label="Return value"
                      >${formattedValue}</div>
                    </section>
                  `
                  : ""
              }

              ${
                error
                  ? html`
                    <section class="output-group" part="output-group error-group">
                      <h4 part="output-heading error-heading">Error:</h4>
                      <div
                        class="result error"
                        part="error-output"
                        role="alert"
                      >${error}</div>
                    </section>
                  `
                  : ""
              }
            </div>
          `
          : ""
      }
    </div>
  `;
}

if (!customElements.get("js-run")) {
  customElements.define(
    "js-run",
    component(JsRun, {
      observedAttributes: ["src", "code", "logs", "value", "error", "badge"],
      useShadowDOM: true,
    })
  );
}
