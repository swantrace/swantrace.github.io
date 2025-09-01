import { defineConfig } from "vite";
import honox from "honox/vite";
import client from "honox/vite/client";
import ssg from "@hono/vite-ssg";
import tailwindcss from "@tailwindcss/vite";

const BUILD_ID = process.env.BUILD_ID ?? String(Date.now());
const BASE = process.env.VITE_BASE ?? "/";

const entry = "./app/server.ts";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      base: BASE,
      plugins: [client(), tailwindcss()],
      build: {
        rollupOptions: {
          input: ["./app/client.ts", "./app/style.css"],
          output: {
            // ensure predictable filenames
            entryFileNames: (chunkInfo) =>
              chunkInfo.name === "client"
                ? "static/client.js"
                : "static/[name].js",
            assetFileNames: "static/[name][extname]",
            chunkFileNames: "static/chunks/[name]-[hash].js",
            manualChunks(id) {
              if (
                id.includes("node_modules/haunted") ||
                id.includes("node_modules/lit-html")
              ) {
                return "wc-vendor"; // -> static/chunks/wc-vendor-xxxx.js
              }
              return undefined;
            },
          },
        },
        emptyOutDir: false,
        sourcemap: false,
      },
    };
  }

  return {
    base: BASE,
    define: {
      __BUILD_ID__: JSON.stringify(BUILD_ID),
    },
    plugins: [honox(), tailwindcss(), ssg({ entry })],
    build: {
      emptyOutDir: false,
      sourcemap: false,
    },
  };
});
