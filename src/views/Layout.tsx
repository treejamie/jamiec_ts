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
