// @jsxImportSource hono/jsx

import { Hono } from "hono";
// Hono JSX components — these render to HTML strings on the server.
// The pragma above tells Bun to use Hono's JSX runtime instead of
// React's, so JSX compiles to Hono's html-string renderer.
import Layout from "./views/Layout.tsx";
import Homepage from "./views/Homepage.tsx";

const app = new Hono();

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
