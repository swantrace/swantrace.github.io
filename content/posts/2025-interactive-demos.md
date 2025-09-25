---
title: Interactive Code Demos
date: 2025-09-24
tags: [demo, javascript, html]
draft: false
excerpt: Testing the new interactive code demo and execution features in blog posts.
---

# Interactive Code Demos

This post demonstrates the new interactive code demo and JavaScript execution features.

## HTML Demo Example

Here's an interactive HTML demo you can view and copy:

```html demo
<div class="border-onyx rounded border bg-gray-50 p-4 dark:bg-gray-900">
  <h2>Hello, World!</h2>
  <p>This is an interactive HTML demo!</p>
  <button onclick="alert('Button clicked!')">Click me!</button>
</div>
```

## JavaScript Execution Example

Here's some JavaScript code that runs at build time:

```js run
function greet(name) {
  console.log("hi", name);
  return { ok: true, who: name };
}
return greet("Alice");
```

## Another JS Example

Let's try some more complex JavaScript:

```javascript run
// Fibonacci sequence
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Computing fibonacci numbers...");
const fibNumbers = [];
for (let i = 0; i < 10; i++) {
  const fib = fibonacci(i);
  fibNumbers.push(fib);
  console.log(`fib(${i}) = ${fib}`);
}

return fibNumbers;
```

## Error Handling Example

Here's an example that demonstrates error handling:

```js run
console.log("This will work fine");
const validOperation = 10 + 5;
console.log("Result:", validOperation);

// This will cause an error
throw new Error("This is a demonstration error!");
```

These interactive examples make it easy to understand code by seeing both the source and the execution results!
