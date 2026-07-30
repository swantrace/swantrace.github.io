import { component, html, useState } from "haunted";
import {
  blockedDemoElements,
  shouldRemoveDemoAttribute,
} from "./html-demo-safety";

function b64dec(s: string): string {
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  const decoded = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  return decodeURIComponent(escape(decoded));
}

/**
 * Keep HTML demos declarative: scripts, embedded documents, inline event
 * handlers, and executable URLs are removed before the preview is mounted.
 */
export function sanitizeDemoFragment(fragment: DocumentFragment): void {
  for (const element of fragment.querySelectorAll(
    blockedDemoElements.join(",")
  )) {
    element.remove();
  }

  for (const element of fragment.querySelectorAll("*")) {
    for (const attribute of [...element.attributes]) {
      if (shouldRemoveDemoAttribute(attribute.name, attribute.value)) {
        element.removeAttribute(attribute.name);
      }
    }
  }
}

class HtmlDemoPreview extends HTMLElement {
  readonly #previewRoot = this.attachShadow({ mode: "open" });
  #content = "";

  constructor() {
    super();
    this.#previewRoot.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }

  set content(source: string) {
    if (source === this.#content) return;
    this.#content = source;

    const template = document.createElement("template");
    template.innerHTML = source;
    sanitizeDemoFragment(template.content);

    const style = document.createElement("style");
    style.textContent = `
      :host {
        box-sizing: border-box;
        display: block;
        color: var(--html-demo-preview-color, inherit);
        font-family: var(--html-demo-font-family, inherit);
      }

      *, *::before, *::after {
        box-sizing: border-box;
      }
    `;

    this.#previewRoot.replaceChildren(style, template.content.cloneNode(true));
  }
}

if (!customElements.get("html-demo-preview")) {
  customElements.define("html-demo-preview", HtmlDemoPreview);
}

function HtmlDemo(this: HTMLElement) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );
  const [showCode, setShowCode] = useState(false);

  const srcAttr = this.getAttribute("src") ?? "";
  const codeAttr = this.getAttribute("code") ?? "";
  const badge = this.getAttribute("badge") ?? "html";
  const sourceCode = srcAttr ? b64dec(srcAttr) : "";
  const highlightedCode = codeAttr ? b64dec(codeAttr) : "";
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

  return html`
    <style>
      :host {
        display: block;
        color: var(--html-demo-color, #111827);
        font-family: var(--html-demo-font-family, sans-serif);
      }

      .frame {
        overflow: hidden;
        border: 1px solid var(--html-demo-border, #e5e7eb);
        background: var(--html-demo-surface, #fff);
      }

      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        border-bottom: 1px solid var(--html-demo-border, #e5e7eb);
        background: var(--html-demo-toolbar, #f9fafb);
        padding: 0.5rem 1rem;
      }

      .badge {
        color: var(--html-demo-muted, #4b5563);
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }

      button {
        border: 0;
        background: transparent;
        color: var(--html-demo-muted, #4b5563);
        cursor: pointer;
        font: inherit;
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
      }

      button:hover {
        background: var(--html-demo-control-hover, #e5e7eb);
        color: var(--html-demo-color, #111827);
      }

      button:focus-visible {
        outline: 2px solid var(--html-demo-focus, #2563eb);
        outline-offset: 2px;
      }

      html-demo-preview {
        background: var(--html-demo-preview, #f9fafb);
        padding: 1rem;
      }

      pre {
        counter-reset: line-number;
        margin: 0;
        overflow-x: auto;
        background: var(--html-demo-code-surface, #f6f8fa);
        color: var(--html-demo-code-color, #24292e);
      }

      code {
        display: block;
        min-width: max-content;
        padding: 1rem 1rem 1rem 3.5rem;
        font-family: var(--html-demo-mono-font, monospace);
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
        color: var(--html-demo-line-number, #6b7280);
        font-size: 0.75rem;
        text-align: right;
        user-select: none;
      }
    </style>

    <div class="frame" part="frame">
      <div class="toolbar" part="toolbar">
        <span class="badge" part="badge">${badge}</span>
        <div class="actions" part="actions">
          ${
            showCode
              ? html`
                <button
                  type="button"
                  part="control copy-button"
                  @click=${copySource}
                  aria-label=${
                    copyStatus === "copied"
                      ? "HTML source copied to clipboard"
                      : copyStatus === "error"
                        ? "HTML source could not be copied"
                        : "Copy HTML source"
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
              `
              : ""
          }
          <button
            type="button"
            part="control toggle-button"
            @click=${() => setShowCode(!showCode)}
            aria-expanded=${String(showCode)}
          >
            ${showCode ? "Hide Code" : "Show Code"}
          </button>
        </div>
      </div>

      <html-demo-preview
        id="html-demo-preview"
        part="preview"
        role="region"
        aria-label="HTML demo preview"
        .content=${sourceCode}
      ></html-demo-preview>

      ${
        showCode
          ? html`
            <pre
              id="html-demo-code"
              part="code"
              tabindex="0"
              aria-label="HTML demo source code"
            ><code
              part="code-content"
              .innerHTML=${codeWithLines}
            ></code></pre>
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
      useShadowDOM: true,
    })
  );
}
