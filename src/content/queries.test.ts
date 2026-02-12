import { afterAll, afterEach, beforeEach, describe, expect, it } from "bun:test";
import { SQL } from "bun";
import { getAllPublishedPosts, getPublishedPostBySlug } from "./queries";

// Integration tests run against the test database.
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

describe("getAllPublishedPosts", () => {
  it("returns only published posts", async () => {
    await sql`INSERT INTO posts (title, slug, status) VALUES ('Draft Post', 'draft-post', 'draft')`;
    await sql`INSERT INTO posts (title, slug, status) VALUES ('Published Post', 'published-post', 'published')`;
    await sql`INSERT INTO posts (title, slug, status) VALUES ('Hidden Post', 'hidden-post', 'hidden')`;

    const posts = await getAllPublishedPosts();

    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe("Published Post");
  });

  it("returns posts ordered by inserted_at descending (newest first)", async () => {
    await sql`INSERT INTO posts (title, slug, status, inserted_at) VALUES ('Older Post', 'older-post', 'published', '2025-01-01')`;
    await sql`INSERT INTO posts (title, slug, status, inserted_at) VALUES ('Newest Post', 'newest-post', 'published', '2026-01-15')`;
    await sql`INSERT INTO posts (title, slug, status, inserted_at) VALUES ('Middle Post', 'middle-post', 'published', '2025-06-15')`;

    const posts = await getAllPublishedPosts();

    expect(posts).toHaveLength(3);
    expect(posts[0].title).toBe("Newest Post");
    expect(posts[1].title).toBe("Middle Post");
    expect(posts[2].title).toBe("Older Post");
  });

  it("returns an empty array when no published posts exist", async () => {
    await sql`INSERT INTO posts (title, slug, status) VALUES ('Draft Only', 'draft-only', 'draft')`;

    const posts = await getAllPublishedPosts();

    expect(posts).toHaveLength(0);
  });

  it("returns an empty array when the posts table is empty", async () => {
    const posts = await getAllPublishedPosts();

    expect(posts).toHaveLength(0);
  });

  it("includes tags for each post", async () => {
    const [post] = await sql`INSERT INTO posts (title, slug, status) VALUES ('Tagged Post', 'tagged-post', 'published') RETURNING id`;
    const [tag1] = await sql`INSERT INTO tags (tag, slug) VALUES ('privacy', 'privacy') RETURNING id`;
    const [tag2] = await sql`INSERT INTO tags (tag, slug) VALUES ('engineering', 'engineering') RETURNING id`;
    await sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, ${tag1.id})`;
    await sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, ${tag2.id})`;

    const posts = await getAllPublishedPosts();

    expect(posts).toHaveLength(1);
    expect(posts[0].tags).toHaveLength(2);
    const tagNames = posts[0].tags.map((t: any) => t.tag).sort();
    expect(tagNames).toEqual(["engineering", "privacy"]);
  });

  it("returns an empty tags array for posts with no tags", async () => {
    await sql`INSERT INTO posts (title, slug, status) VALUES ('No Tags', 'no-tags', 'published')`;

    const posts = await getAllPublishedPosts();

    expect(posts).toHaveLength(1);
    expect(posts[0].tags).toEqual([]);
  });

  it("does not duplicate posts when they have multiple tags", async () => {
    const [post] = await sql`INSERT INTO posts (title, slug, status) VALUES ('Multi Tag', 'multi-tag', 'published') RETURNING id`;
    const [t1] = await sql`INSERT INTO tags (tag, slug) VALUES ('a', 'a') RETURNING id`;
    const [t2] = await sql`INSERT INTO tags (tag, slug) VALUES ('b', 'b') RETURNING id`;
    const [t3] = await sql`INSERT INTO tags (tag, slug) VALUES ('c', 'c') RETURNING id`;
    await sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, ${t1.id})`;
    await sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, ${t2.id})`;
    await sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, ${t3.id})`;

    const posts = await getAllPublishedPosts();

    expect(posts).toHaveLength(1);
    expect(posts[0].tags).toHaveLength(3);
  });
});
