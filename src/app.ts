import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("OK");
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
