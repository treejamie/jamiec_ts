import { describe, expect, it } from "bun:test";
import { insertPostSchema, insertTagSchema } from "./validation";

describe("insertPostSchema", () => {
  it("requires a title", () => {
    const result = insertPostSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts a valid post with just a title", () => {
    const result = insertPostSchema.safeParse({ title: "Hello World" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Hello World");
    }
  });

  it("defaults status to 'draft'", () => {
    const result = insertPostSchema.safeParse({ title: "Test" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("draft");
    }
  });

  it("accepts valid status values", () => {
    for (const status of ["draft", "published", "hidden"]) {
      const result = insertPostSchema.safeParse({ title: "Test", status });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(status);
      }
    }
  });

  it("rejects invalid status values", () => {
    const result = insertPostSchema.safeParse({
      title: "Test",
      status: "archived",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional description", () => {
    const result = insertPostSchema.safeParse({
      title: "Test",
      description: "A description",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe("A description");
    }
  });

  it("accepts optional markdown_body", () => {
    const result = insertPostSchema.safeParse({
      title: "Test",
      markdown_body: "# Heading",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.markdown_body).toBe("# Heading");
    }
  });

  it("generates html_body from markdown_body", () => {
    const result = insertPostSchema.safeParse({
      title: "Test",
      markdown_body: "# Heading\n\nA paragraph.",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.html_body).toContain("<h1>Heading</h1>");
      expect(result.data.html_body).toContain("<p>A paragraph.</p>");
    }
  });

  it("leaves html_body undefined when no markdown_body", () => {
    const result = insertPostSchema.safeParse({ title: "Test" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.html_body).toBeUndefined();
    }
  });
});

describe("insertTagSchema", () => {
  it("requires a tag name", () => {
    const result = insertTagSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts a valid tag and generates a slug", () => {
    const result = insertTagSchema.safeParse({ tag: "My Tag" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tag).toBe("My Tag");
      expect(result.data.slug).toBe("my-tag");
    }
  });

  it("generates slug: strips non-alphanumeric except hyphens, lowercases", () => {
    const cases = [
      { input: "My Tag", expected: "my-tag" },
      { input: "Hello World!", expected: "hello-world" },
      { input: "  --trimmed-- ", expected: "trimmed" },
      { input: "UPPER CASE", expected: "upper-case" },
    ];

    for (const { input, expected } of cases) {
      const result = insertTagSchema.safeParse({ tag: input });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBe(expected);
      }
    }
  });
});
