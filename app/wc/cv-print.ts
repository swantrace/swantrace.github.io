import { component, html } from "haunted";

function CvPrint() {
  return html`
    <button type="button" class="btn btn-outline btn-sm" @click=${() => window.print()}>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="size-4">
        <path d="M7 8V3h10v5M7 17H4V8h16v9h-3M7 14h10v7H7zM17 11h.01" />
      </svg>
      Print / save PDF
    </button>
  `;
}

customElements.define("cv-print", component(CvPrint, { useShadowDOM: false }));
