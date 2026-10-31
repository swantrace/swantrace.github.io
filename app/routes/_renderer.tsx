import { jsxRenderer } from "hono/jsx-renderer";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { url } from "../utils/url";

declare const __BUILD_ID__: string;

export default jsxRenderer(({ children }, c) => {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try { const theme = localStorage.getItem("theme"); if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme; } catch {}`,
          }}
        />

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
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header path={c.req.path} />
        <div className="site-content">
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
});
