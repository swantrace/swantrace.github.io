import { html, component, useEffect, useState } from "haunted";

function ThemeSwitcher() {
  const [theme, setTheme] = useState<string>(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      try {
        localStorage.setItem("theme", theme);
      } catch {
        /* ignore */
      }
    }
  }, [theme]);

  return html`
    <div class="form-control">
      <label class="label cursor-pointer gap-2">
        <span class="label-text">Light</span>
        <input
          type="checkbox"
          class="toggle toggle-primary"
          ?checked=${theme === "dark"}
          @change=${() => setTheme(theme === "light" ? "dark" : "light")}
        />
        <span class="label-text">Dark</span>
      </label>
    </div>
  `;
}

if (!customElements.get("theme-switcher")) {
  customElements.define(
    "theme-switcher",
    component(ThemeSwitcher, {
      useShadowDOM: false,
    })
  );
}

export {};
