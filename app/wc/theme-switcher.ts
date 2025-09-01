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
      class="border-0 p-0 whitespace-nowrap flex justify-center mb-8"
      id="mode-switcher"
    >
      <legend class="text-[2px] opacity-0 absolute">Color Scheme</legend>

      <input
        type="radio"
        name="color-scheme"
        id="light"
        class="opacity-0 absolute"
        ?checked=${theme === "light"}
        @change=${() => setTheme("light")}
      />
      <label
        for="light"
        class="inline-block leading-8 text-[0.9rem] relative z-[2] pr-[4.5em]
               /* KNOB (::before) */
               before:content-[''] before:bg-whiteish before:border before:border-onyx before:rounded-full 
               before:absolute before:right-[-0.075em] before:h-[2em] before:w-[2em] before:z-[2]
               before:transform before:transition-transform before:duration-200 before:ease-in-out
               before:top-1/2 before:-translate-y-1/2
               /* TRACK (::after) */
               after:content-[''] after:border after:border-onyx after:rounded-[1em]
               after:h-[2em] after:w-[4em] after:absolute after:right-[-0.075em] after:top-1/2 after:-translate-y-1/2
               after:transition-colors after:duration-200 after:ease-in-out after:pointer-events-none
               ${theme === "light"
          ? "after:bg-marina before:-translate-x-[2em]"
          : "after:bg-[#777] before:translate-x-0"}"
      >
        Light
      </label>

      <input
        type="radio"
        name="color-scheme"
        id="dark"
        class="opacity-0 absolute"
        ?checked=${theme === "dark"}
        @change=${() => setTheme("dark")}
      />
      <label
        for="dark"
        class="inline-block leading-8 text-[0.9rem] relative -ml-[4.25em] pl-[5em]
               ${theme === "dark" ? "z-[1]" : "z-[2]"}"
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
