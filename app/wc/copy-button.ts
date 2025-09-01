import { html, component, useState } from "haunted";

// 自定义元素：<copy-button text="要复制的文本"></copy-button>
function CopyButton(this: HTMLElement) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const text = this.getAttribute("text") ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // 可选：错误处理 / toast
    }
  };

  return html`
    <button
      class="px-2 py-1 border rounded text-sm hover:bg-gray-100"
      @click=${onClick}
    >
      ${copied ? "Copied!" : "Copy"}
    </button>
  `;
}

if (!customElements.get("copy-button")) {
  customElements.define("copy-button", component(CopyButton));
}

export {};
