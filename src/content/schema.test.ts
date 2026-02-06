import { afterAll, afterEach, describe, expect, it } from "bun:test";
import { SQL } from "bun";

// Integration tests run against the test database.
// Uses DATABASE_URL env var, falls back to local test DB.
const sql = new SQL(
  process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/jamiec_ts_test",
);

// Helper: asserts that an async SQL operation throws.
// Using try/catch because expect().rejects.toThrow() hangs with Bun.sql.
async function expectToThrow(fn: () => Promise<unknown>) {
  try {
    await fn();
    expect.unreachable("expected query to throw");
  } catch (err) {
    expect(err).toBeDefined();
  }
}

afterEach(async () => {
  // Clean tables in order respecting FK constraints
  await sql`DELETE FROM posts_tags`;
  await sql`DELETE FROM tags`;
  await sql`DELETE FROM posts`;
});

afterAll(async () => {
  await sql.close();
});

describe("posts table constraints", () => {
  it("inserts a post with just a title", async () => {
    const [post] = await sql`
      INSERT INTO posts (title) VALUES ('Test Post') RETURNING *
    `;
    expect(post.title).toBe("Test Post");
    expect(post.id).toBeGreaterThan(0);
  });

  it("rejects insert without title (NOT NULL)", async () => {
    await expectToThrow(() =>
      sql`INSERT INTO posts (description) VALUES ('no title')`,
    );
  });

  it("defaults status to 'draft'", async () => {
    const [post] = await sql`
      INSERT INTO posts (title) VALUES ('Draft Test') RETURNING status
    `;
    expect(post.status).toBe("draft");
  });

  it("rejects invalid status (CHECK constraint)", async () => {
    await expectToThrow(() =>
      sql`INSERT INTO posts (title, status) VALUES ('Test', 'archived')`,
    );
  });

  it("accepts valid status values", async () => {
    for (const status of ["draft", "published", "hidden"]) {
      const [post] = await sql`
        INSERT INTO posts (title, status)
        VALUES (${`Test ${status}`}, ${status})
        RETURNING status
      `;
      expect(post.status).toBe(status);
    }
  });

  it("sets inserted_at and updated_at automatically", async () => {
    const [post] = await sql`
      INSERT INTO posts (title) VALUES ('Timestamp Test')
      RETURNING inserted_at, updated_at
    `;
    expect(post.inserted_at).toBeInstanceOf(Date);
    expect(post.updated_at).toBeInstanceOf(Date);
  });
});

describe("tags table constraints", () => {
  it("inserts a tag successfully", async () => {
    const [tag] = await sql`
      INSERT INTO tags (tag, slug) VALUES ('TypeScript', 'typescript')
      RETURNING *
    `;
    expect(tag.tag).toBe("TypeScript");
    expect(tag.slug).toBe("typescript");
  });

  it("rejects duplicate slug (UNIQUE)", async () => {
    await sql`INSERT INTO tags (tag, slug) VALUES ('TypeScript', 'typescript')`;
    await expectToThrow(() =>
      sql`INSERT INTO tags (tag, slug) VALUES ('Also TS', 'typescript')`,
    );
  });

  it("rejects insert without tag name (NOT NULL)", async () => {
    await expectToThrow(() =>
      sql`INSERT INTO tags (slug) VALUES ('orphan-slug')`,
    );
  });

  it("rejects insert without slug (NOT NULL)", async () => {
    await expectToThrow(() => sql`INSERT INTO tags (tag) VALUES ('No Slug')`);
  });
});

describe("posts_tags join table constraints", () => {
  it("inserts a valid post-tag pair", async () => {
    const [post] = await sql`INSERT INTO posts (title) VALUES ('Post') RETURNING id`;
    const [tag] = await sql`INSERT INTO tags (tag, slug) VALUES ('Tag', 'tag') RETURNING id`;

    await sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, ${tag.id})`;

    const rows = await sql`SELECT * FROM posts_tags WHERE post_id = ${post.id}`;
    expect(rows).toHaveLength(1);
  });

  it("rejects duplicate post-tag pair (UNIQUE index)", async () => {
    const [post] = await sql`INSERT INTO posts (title) VALUES ('Post') RETURNING id`;
    const [tag] = await sql`INSERT INTO tags (tag, slug) VALUES ('Tag', 'tag') RETURNING id`;

    await sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, ${tag.id})`;
    await expectToThrow(() =>
      sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, ${tag.id})`,
    );
  });

  it("cascades delete when post is deleted", async () => {
    const [post] = await sql`INSERT INTO posts (title) VALUES ('Post') RETURNING id`;
    const [tag] = await sql`INSERT INTO tags (tag, slug) VALUES ('Tag', 'tag') RETURNING id`;
    await sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, ${tag.id})`;

    await sql`DELETE FROM posts WHERE id = ${post.id}`;

    const rows = await sql`SELECT * FROM posts_tags WHERE post_id = ${post.id}`;
    expect(rows).toHaveLength(0);
  });

  it("cascades delete when tag is deleted", async () => {
    const [post] = await sql`INSERT INTO posts (title) VALUES ('Post') RETURNING id`;
    const [tag] = await sql`INSERT INTO tags (tag, slug) VALUES ('Tag', 'tag') RETURNING id`;
    await sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, ${tag.id})`;

    await sql`DELETE FROM tags WHERE id = ${tag.id}`;

    const rows = await sql`SELECT * FROM posts_tags WHERE tag_id = ${tag.id}`;
    expect(rows).toHaveLength(0);
  });

  it("rejects invalid foreign key for post_id", async () => {
    const [tag] = await sql`INSERT INTO tags (tag, slug) VALUES ('Tag', 'tag') RETURNING id`;
    await expectToThrow(() =>
      sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (99999, ${tag.id})`,
    );
  });

  it("rejects invalid foreign key for tag_id", async () => {
    const [post] = await sql`INSERT INTO posts (title) VALUES ('Post') RETURNING id`;
    await expectToThrow(() =>
      sql`INSERT INTO posts_tags (post_id, tag_id) VALUES (${post.id}, 99999)`,
    );
  });
});
