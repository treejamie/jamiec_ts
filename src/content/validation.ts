import { z } from "zod";
import { marked } from "marked";

// Convert markdown string to HTML using marked (synchronous)
function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

// Generates a URL-safe slug from a string:
// - lowercase
// - replace spaces with hyphens
// - strip non-alphanumeric characters (except hyphens)
// - collapse consecutive hyphens
// - trim leading/trailing hyphens
function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const postStatusEnum = z.enum(["draft", "published", "hidden"]);

// Schema for inserting a new post.
// Title is required; status defaults to "draft".
// When markdown_body is provided, html_body is auto-generated.
export const insertPostSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    markdown_body: z.string().optional(),
    status: postStatusEnum.default("draft"),
  })
  .transform((data) => ({
    ...data,
    html_body: data.markdown_body
      ? markdownToHtml(data.markdown_body)
      : undefined,
  }));

// Schema for inserting a new tag.
// Tag name is required; slug is auto-generated from the tag name.
export const insertTagSchema = z
  .object({
    tag: z.string(),
  })
  .transform((data) => ({
    ...data,
    slug: generateSlug(data.tag),
  }));

export type InsertPost = z.output<typeof insertPostSchema>;
export type InsertTag = z.output<typeof insertTagSchema>;
