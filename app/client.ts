// 1) DOM Ready
function onDomReady(cb: () => void) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", cb, { once: true });
  } else cb();
}

// 2) 空闲时机（有 requestIdleCallback 就用，没有就退化到 setTimeout）
function idle(cb: () => void) {
  const ric = window.requestIdleCallback?.bind(window);
  ric ? ric(cb, { timeout: 1500 }) : setTimeout(cb, 800);
}

// 3) 懒加载并定义自定义元素：
// - 首次"需要时"（元素出现在 DOM 且进入视口）才执行 loader()
// - 已定义过同名元素则直接跳过
function lazyDefine(
  tagOrSelector: string,
  loader: () => Promise<unknown>,
  opts?: {
    whenVisible?: boolean;
    onBeforeDefine?: (element: HTMLElement) => void | Promise<void>;
    onAfterDefine?: (element: HTMLElement) => void | Promise<void>;
    customElementName?: string; // For customized built-in elements
    extendsTag?: string; // For customized built-in elements
  }
) {
  const whenVisible = opts?.whenVisible ?? true;
  const customElementName = opts?.customElementName || tagOrSelector;

  const defineNow = async () => {
    if (customElements.get(customElementName)) return;

    const element = document.querySelector<HTMLElement>(tagOrSelector);
    if (element && opts?.onBeforeDefine) {
      await opts.onBeforeDefine(element);
    }

    await loader(); // 只在真正需要时才下载 haunted/组件模块

    if (element && opts?.onAfterDefine) {
      await opts.onAfterDefine(element);
    }
  };

  // 页面已有该元素：按可见性策略加载
  const first = document.querySelector<HTMLElement>(tagOrSelector);
  if (first) {
    if (!whenVisible) {
      defineNow();
    } else {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            io.disconnect();
            defineNow();
            break;
          }
        }
      });
      io.observe(first);
    }
  }

  // 监听后续动态插入（例如分页/切换主题时注入新节点）
  const mo = new MutationObserver(() => {
    if (customElements.get(customElementName)) {
      mo.disconnect();
      return;
    }
    const el = document.querySelector(tagOrSelector);
    if (el) {
      mo.disconnect();
      whenVisible ? lazyDefine(tagOrSelector, loader, opts) : defineNow();
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
}

onDomReady(() => {
  // === 在这里登记你要懒加载的 Web Components ===
  lazyDefine("theme-switcher", () => import("./wc/theme-switcher"), {
    whenVisible: true,
  });
  // Enhanced div with is="blog-list-div" attribute
  lazyDefine('div[is="blog-list-div"]', () => import("./wc/blog-list"), {
    whenVisible: true,
    customElementName: "blog-list-div",
    extendsTag: "div",
    onBeforeDefine: async (element) => {
      // Check if element already has posts-data attribute from SSR
      if (!element.getAttribute("posts-data")) {
        // Load posts data if not already provided
        const base = import.meta.env.VITE_BASE ?? "/";
        const absBase = location.origin + base;
        const postsURL = new URL("posts.json", absBase).toString();

        try {
          const res = await fetch(postsURL, { cache: "no-store" });
          if (!res.ok)
            throw new Error(`Failed to load posts.json: ${res.status}`);
          const posts = await res.json();

          // Set posts data as attribute
          element.setAttribute("posts-data", JSON.stringify(posts));
        } catch (error) {
          console.error("Failed to load posts:", error);
          // Component will still load but without data
        }
      }
    },
  });
});

// 4) （可选）空闲时预热最常用组件，减少用户滚动到时的等待
idle(() => {
  // 预热 copy-button（若用户从未滚到也不会阻塞首屏）
  import("./wc/theme-switcher");
  // Preload blog-list-div component for better UX on blog pages
  import("./wc/blog-list");
  // import("./wc/theme-toggle");
});
