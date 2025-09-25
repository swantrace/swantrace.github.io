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
      class="mb-8 flex items-center justify-center gap-0 border-0 p-0"
      id="mode-switcher"
    >
      <legend class="absolute text-[2px] opacity-0">Color Scheme</legend>

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
        class="cursor-pointer px-3 py-2 text-[0.9rem] text-gray-700 transition-colors duration-200 dark:text-gray-300"
      >
        Light
      </label>

      <!-- Toggle Container -->
      <div
        class="relative flex cursor-pointer items-center"
        @click=${() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <!-- Track -->
        <div
          class="border-onyx ${theme === "light"
            ? "bg-marina"
            : "bg-gray-400"} h-6 w-12 rounded-full border transition-colors duration-200"
        ></div>

        <!-- Knob -->
        <div
          class="bg-whiteish border-onyx ${theme === "light"
            ? "translate-x-0.5"
            : "translate-x-6"} absolute h-5 w-5 rounded-full border transition-transform duration-200 ease-in-out"
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
        class="cursor-pointer px-3 py-2 text-[0.9rem] text-gray-700 transition-colors duration-200 dark:text-gray-300"
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
