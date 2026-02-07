// @jsxImportSource hono/jsx

import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import Layout from "./views/Layout.tsx";
import Homepage from "./views/Homepage.tsx";

const app = new Hono();

// Serve static files (CSS, images, etc.) from the public/ directory.
// Requests to /static/* are mapped to public/static/* on disk.
app.use("/static/*", serveStatic({ root: "./public/" }));

// Homepage — renders the full page with Layout wrapper.
// c.html() takes a JSX element (or string) and returns a Response
// with Content-Type: text/html.
app.get("/", (c) => {
  return c.html(
    <Layout>
      <Homepage />
    </Layout>
  );
});

// Health check endpoint (used by Docker, load balancers, etc.)
app.get("/health", (c) => {
  return c.text("hello");
});

// Public post view by slug
app.get("/post/:slug", (c) => {
  return c.text("hello");
});

// Office routes — will be auth-protected later
app.get("/office/posts", (c) => {
  return c.text("hello");
});

app.get("/office/posts/create", (c) => {
  return c.text("hello");
});

app.get("/office/posts/edit", (c) => {
  return c.text("hello");
});

export default app;
