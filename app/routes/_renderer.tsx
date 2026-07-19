import { jsxRenderer } from "hono/jsx-renderer";
import { Footer } from "../components/footer";
import { url } from "../utils/url";

declare const __BUILD_ID__: string;

export default jsxRenderer(({ children }) => {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* CSS */}
        {import.meta.env.DEV ? (
          <link href="/app/style.css" rel="stylesheet" />
        ) : (
          <link
            href={url(`/static/style.css?v=${__BUILD_ID__}`)}
            rel="stylesheet"
          />
        )}

        {/* JS */}
        {import.meta.env.DEV ? (
          <script type="module" src="/app/client.ts"></script>
        ) : (
          <script
            type="module"
            src={url(`/static/client.js?v=${__BUILD_ID__}`)}
            defer
          ></script>
        )}
      </head>
      <body className="bg-base-100 text-base-content min-h-screen">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Theme switcher */}
          <div className="mb-8 flex justify-center md:justify-end">
            <theme-switcher></theme-switcher>
          </div>

          {/* page content injected by routes */}
          {children}

          <Footer />
        </div>
      </body>
    </html>
  );
});
