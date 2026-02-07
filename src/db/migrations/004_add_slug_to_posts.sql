ALTER TABLE posts ADD COLUMN slug varchar UNIQUE;

CREATE UNIQUE INDEX idx_posts_slug ON posts (slug);
