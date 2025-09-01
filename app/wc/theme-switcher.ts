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
      document.documentElement.className = theme;
      try {
        localStorage.setItem("theme", theme);
      } catch {
        /* ignore */
      }
    }
  }, [theme]);

  return html`
    <fieldset
      class="border-0 p-0 flex items-center justify-center gap-0 mb-8"
      id="mode-switcher"
    >
      <legend class="text-[2px] opacity-0 absolute">Color Scheme</legend>

      <!-- Light Label -->
      <input
        type="radio"
        name="color-scheme"
        id="light"
        class="sr-only"
        ?checked=${theme === "light"}
        @change=${() => setTheme("light")}
      />
      <label
        for="light"
        class="px-3 py-2 text-[0.9rem] cursor-pointer transition-colors duration-200
               text-gray-700 dark:text-gray-300"
      >
        Light
      </label>

      <!-- Toggle Container -->
      <div
        class="relative flex items-center cursor-pointer"
        @click=${() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <!-- Track -->
        <div
          class="w-12 h-6 rounded-full border border-onyx transition-colors duration-200
                 ${theme === "light" ? "bg-marina" : "bg-gray-400"}"
        ></div>

        <!-- Knob -->
        <div
          class="absolute w-5 h-5 bg-whiteish border border-onyx rounded-full 
                 transition-transform duration-200 ease-in-out
                 ${theme === "light" ? "translate-x-0.5" : "translate-x-6"}"
        ></div>
      </div>

      <!-- Dark Label -->
      <input
        type="radio"
        name="color-scheme"
        id="dark"
        class="sr-only"
        ?checked=${theme === "dark"}
        @change=${() => setTheme("dark")}
      />
      <label
        for="dark"
        class="px-3 py-2 text-[0.9rem] cursor-pointer transition-colors duration-200
               text-gray-700 dark:text-gray-300"
      >
        Dark
      </label>
    </fieldset>
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
