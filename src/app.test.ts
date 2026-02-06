import { describe, expect, it } from "bun:test";
import app from "./app";

describe("GET /", () => {
  it("returns 200", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
  });
});
