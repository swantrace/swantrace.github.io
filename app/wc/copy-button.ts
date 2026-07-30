import { component, html, useState } from "haunted";

function CopyButton(this: HTMLElement) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  const onClick = async () => {
    const text = this.getAttribute("text") ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 1200);
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const label =
    copyStatus === "copied"
      ? "Copied!"
      : copyStatus === "error"
        ? "Copy failed"
        : "Copy";

  return html`
    <style>
      :host {
        display: inline-block;
        font-family: var(--copy-button-font-family, sans-serif);
      }

      button {
        border: 1px solid var(--copy-button-border, #d1d5db);
        border-radius: var(--copy-button-radius, 0.375rem);
        background: var(--copy-button-surface, transparent);
        color: var(--copy-button-color, #374151);
        cursor: pointer;
        font: inherit;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.25rem;
        padding: 0.375rem 0.75rem;
      }

      button:hover {
        border-color: var(--copy-button-hover-border, #9ca3af);
        background: var(--copy-button-hover-surface, #f3f4f6);
        color: var(--copy-button-hover-color, #111827);
      }

      button:focus-visible {
        outline: 2px solid var(--copy-button-focus, #2563eb);
        outline-offset: 2px;
      }
    </style>

    <button
      type="button"
      part="button"
      @click=${onClick}
      aria-label=${
        copyStatus === "copied"
          ? "Copied to clipboard"
          : copyStatus === "error"
            ? "Copy failed"
            : "Copy to clipboard"
      }
    >
      <span part="label" aria-live="polite">
        ${label}
      </span>
    </button>
  `;
}

if (!customElements.get("copy-button")) {
  customElements.define(
    "copy-button",
    component(CopyButton, {
      observedAttributes: ["text"],
      useShadowDOM: true,
    })
  );
}
