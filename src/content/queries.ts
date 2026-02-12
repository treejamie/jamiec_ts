import sql from "../db/index";

export async function getPublishedPostBySlug(slug: string) {
  const rows = await sql`
    SELECT * FROM posts WHERE slug = ${slug} AND status = 'published' LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getAllPublishedPosts() {
  const rows = await sql`
    SELECT
      p.*,
      coalesce(
        json_agg(json_build_object('id', t.id, 'tag', t.tag, 'slug', t.slug))
        FILTER (WHERE t.id IS NOT NULL),
        '[]'
      ) AS tags
    FROM posts p
    LEFT JOIN posts_tags pt ON pt.post_id = p.id
    LEFT JOIN tags t ON t.id = pt.tag_id
    WHERE p.status = 'published'
    GROUP BY p.id
    ORDER BY p.inserted_at DESC
  `;
  return rows;
}
