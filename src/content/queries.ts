import sql from "../db/index";

export async function getPublishedPosts() {
  const rows = await sql`
    SELECT id, title, slug, inserted_at FROM posts
    WHERE status = 'published'
    ORDER BY inserted_at DESC
  `;
  return rows;
}

export async function getPublishedPostBySlug(slug: string) {
  const rows = await sql`
    SELECT * FROM posts WHERE slug = ${slug} AND status = 'published' LIMIT 1
  `;
  return rows[0] ?? null;
}
