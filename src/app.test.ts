import { afterAll, afterEach, describe, expect, it } from "bun:test";
import { SQL } from "bun";
import app from "./app";

// Test DB connection for inserting/cleaning test data
const sql = new SQL(
  process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/jamiec_ts_test",
);

afterEach(async () => {
  await sql`DELETE FROM posts_tags`;
  await sql`DELETE FROM tags`;
  await sql`DELETE FROM posts`;
});

afterAll(async () => {
  await sql.close();
});

describe("GET /", () => {
  it("returns 200", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
  });
});

describe("GET /health", () => {
  it("returns 200", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
  });
});

describe("GET /post/:slug", () => {
  it("returns 404 when slug does not exist", async () => {
    const res = await app.request("/post/nonexistent-slug");
    expect(res.status).toBe(404);
  });

  it("returns 404 when post exists but is not published", async () => {
    await sql`
      INSERT INTO posts (title, slug, status)
      VALUES ('Draft Post', 'draft-post', 'draft')
    `;
    const res = await app.request("/post/draft-post");
    expect(res.status).toBe(404);
  });

  it("returns 200 with post content when post is published", async () => {
    await sql`
      INSERT INTO posts (title, description, slug, html_body, status)
      VALUES ('My Post', 'A test post', 'my-post', '<p>Hello world</p>', 'published')
    `;
    const res = await app.request("/post/my-post");
    expect(res.status).toBe(200);

    const html = await res.text();
    expect(html).toContain("My Post");
    expect(html).toContain("A test post");
    expect(html).toContain("<p>Hello world</p>");
  });
});

describe("GET /office/posts", () => {
  it("returns 200", async () => {
    const res = await app.request("/office/posts");
    expect(res.status).toBe(200);
  });
});

describe("GET /office/posts/create", () => {
  it("returns 200", async () => {
    const res = await app.request("/office/posts/create");
    expect(res.status).toBe(200);
  });
});

describe("GET /office/posts/edit", () => {
  it("returns 200", async () => {
    const res = await app.request("/office/posts/edit");
    expect(res.status).toBe(200);
  });
});
