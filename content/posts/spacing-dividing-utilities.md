---
title: "Tailwind CSS Spacing and State Utilities"
date: "2025-01-15"
tags: ["tailwindcss", "css", "spacing", "state-variants"]
topic: ["frontend", 3]
draft: true
excerpt:
  "Interactive examples of spacing utilities, peer state variants,
  and floating labels with Tailwind CSS."
---

```html demo
<div class="space-y-4 bg-sky-100 px-4">
  <div class="border-2 border-fuchsia-600 bg-fuchsia-500 text-center">
    First
  </div>
  <div class="border-2 border-fuchsia-600 bg-fuchsia-500 text-center">
    Second
  </div>
  <div class="border-2 border-fuchsia-600 bg-fuchsia-500 text-center">
    Third
  </div>
  <div class="border-2 border-fuchsia-600 bg-fuchsia-500 text-center">
    Fourth
  </div>
</div>
```

```html demo
<div class="space-x-8">
  <button
    class="rounded border-2 border-sky-700 bg-sky-500 px-4 py-2 text-white shadow-md"
  >
    Button
  </button>
  <button
    class="rounded border-2 border-sky-700 bg-sky-500 px-4 py-2 text-white shadow-md"
  >
    Button
  </button>
  <button
    class="rounded border-2 border-sky-700 bg-sky-500 px-4 py-2 text-white shadow-md"
  >
    Button
  </button>
</div>
```

```html demo
<label class="flex items-center gap-2">
  <input
    id="all"
    type="checkbox"
    class="peer h-4 w-4 rounded border"
  />
  <span
    class="transition peer-checked:text-green-600 peer-indeterminate:text-blue-600"
  >
    全选（支持部分选中）
  </span>
</label>

<script>
  // 运行时设置 indeterminate
  const all = document.getElementById("all");
  // 示例：进入“部分选中”视觉态
  all.indeterminate = true;

  // 实战里通常根据子项选中情况更新：
  // all.indeterminate = someChecked && !allChecked;
</script>
```

```html demo
<label class="relative block">
  <input
    type="text"
    placeholder=" "
    class="peer w-full rounded border px-3 py-2 placeholder-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
  />
  <span
    class="pointer-events-none absolute top-2.5 left-3 text-gray-500 transition peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600"
  >
    用户名
  </span>
</label>
```
