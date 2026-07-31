---
slug: interactive-markdown-demo-test
title: "Interactive Markdown Demo Test"
date: null
tags:
  - markdown
  - web-components
  - html-demo
  - js-run
  - testing
topic: null
draft: true
excerpt: "Verify HTML preview isolation, native form validation, code controls, and build-time JavaScript output across the custom Markdown components."
---

# Interactive Markdown Demo Test

This draft is a visual test page for the custom `html demo` and `js run`
Markdown fences. It is intentionally excluded from production builds.

## Copy button

The standalone component should copy the configured `text` attribute and
announce success or failure.

<copy-button text="bun run test:all">
  <button type="button" disabled>Copy unavailable</button>
</copy-button>

## HTML demo

The following example tests:

- CSS contained inside the preview
- Semantic form controls and labels
- Native `required`, `type="email"`, and length validation
- Keyboard interaction
- **Show Code**, **Hide Code**, and **Copy**

Submitting valid input should not navigate away from this page. The component
prevents the final submission while leaving native browser validation active.

```html demo
<style>
  .demo-form {
    display: grid;
    gap: 1rem;
    max-width: 30rem;
    padding: 1.25rem;
    border: 1px solid #bae6fd;
    border-radius: 0.75rem;
    background: #f0f9ff;
    color: #0c4a6e;
    font-family: system-ui, sans-serif;
  }

  .demo-form h3 {
    margin: 0;
    font-size: 1.25rem;
  }

  .demo-field {
    display: grid;
    gap: 0.375rem;
  }

  .demo-field label {
    font-weight: 600;
  }

  .demo-field input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid #7dd3fc;
    border-radius: 0.375rem;
    background: white;
    color: #0f172a;
    font: inherit;
  }

  .demo-field input:focus {
    outline: 3px solid #bae6fd;
    border-color: #0284c7;
  }

  .demo-field input:user-invalid {
    border-color: #dc2626;
  }

  .demo-hint {
    margin: 0;
    color: #475569;
    font-size: 0.875rem;
  }

  .demo-submit {
    justify-self: start;
    padding: 0.625rem 1rem;
    border: 0;
    border-radius: 0.375rem;
    background: #0369a1;
    color: white;
    cursor: pointer;
    font: inherit;
    font-weight: 600;
  }

  .demo-submit:hover {
    background: #075985;
  }
</style>

<form class="demo-form">
  <h3>Request a demo</h3>

  <div class="demo-field">
    <label for="demo-name">Name</label>
    <input
      id="demo-name"
      name="name"
      autocomplete="name"
      minlength="2"
      required
    >
  </div>

  <div class="demo-field">
    <label for="demo-email">Email</label>
    <input
      id="demo-email"
      name="email"
      type="email"
      autocomplete="email"
      aria-describedby="demo-email-hint"
      required
    >
    <p id="demo-email-hint" class="demo-hint">
      Enter a valid email address to test native validation.
    </p>
  </div>

  <button class="demo-submit" type="submit">Submit</button>
</form>
```

The styles above should affect only the form preview. They should not change
the article, demo toolbar, or code controls.

## JavaScript logs and return value

This snippet runs during Markdown processing. The browser receives only the
captured output and highlighted source.

```js run
const scores = [72, 88, 95];
const total = scores.reduce((sum, score) => sum + score, 0);
const average = total / scores.length;

console.log("scores", scores);
console.info("average", average.toFixed(2));

return {
  count: scores.length,
  total,
  average,
};
```

## Asynchronous JavaScript result

Top-level `await` should be handled during the static build.

```javascript {run}
const status = await Promise.resolve("ready");
console.log("async status", status);
return status;
```

## JavaScript error output

This error is deliberate. It verifies that a failed snippet is displayed as
content instead of breaking the complete Markdown page.

```js run
console.warn("The next error is intentional.");
throw new Error("Intentional demo error");
```

## Expected result

- The HTML form is visible and styled.
- Invalid form values trigger native browser validation.
- A valid form submission remains on the current page.
- HTML demo controls remain styled in light and dark themes.
- Each JS block shows source code and a copy control.
- Console output, returned values, and the intentional error appear separately.
- No JavaScript from the HTML demo runs in the browser.
