import { jsxRenderer } from "hono/jsx-renderer";
import { url } from "../utils/url";
import { Footer } from "../components/footer";

declare const __BUILD_ID__: string;

export default jsxRenderer(({ children }) => {
  return (
    <html lang="en" class="">
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
      <body className="bg-platinum text-onyx dark:bg-charcoal dark:text-whiteish font-sans text-base md:text-lg">
        <div id="wrapper" className="mx-auto max-w-[1200px] p-4 md:p-20">
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
