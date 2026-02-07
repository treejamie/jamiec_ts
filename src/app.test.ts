import { describe, expect, it } from "bun:test";
import app from "./app";

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
  it("returns 200", async () => {
    const res = await app.request("/post/my-first-post");
    expect(res.status).toBe(200);
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
