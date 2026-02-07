import sql from "../db/index";

export async function getPublishedPostBySlug(slug: string) {
  const rows = await sql`
    SELECT * FROM posts WHERE slug = ${slug} AND status = 'published' LIMIT 1
  `;
  return rows[0] ?? null;
}
