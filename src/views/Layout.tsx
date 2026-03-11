// @jsxImportSource hono/jsx

/**
 * Layout.tsx — Base HTML shell for all pages.
 *
 * Hono JSX works like React JSX but renders to HTML strings on the server.
 * There's no client-side hydration — it's pure server-side rendering.
 *
 * Key differences from React:
 * - Use `class` not `className` (Hono renders raw HTML)
 * - `style` accepts a string or an object
 * - Components are typed with `FC` from "hono/jsx"
 * - `children` is passed via `PropsWithChildren` or inline in the props type
 */

import type { Child, FC } from "hono/jsx";

// Props for the layout — title and description for the <head>
interface LayoutProps {
  title?: string;
  description?: string;
  children: Child;
}

// The Layout component wraps every page with a full HTML document.
// CSS is served as a static file from public/static/style.css.
const Layout: FC<LayoutProps> = ({
  title = "Jamie Curle",
  description = "Lead Software Engineer",
  children,
}) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;1,400&family=Playfair+Display:wght@400;700&family=Source+Serif+4:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <title>{title}</title>
        <link rel="stylesheet" href="/static/style.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};

export default Layout;
