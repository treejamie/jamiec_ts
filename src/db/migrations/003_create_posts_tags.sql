CREATE TABLE posts_tags (
  post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id integer NOT NULL REFERENCES tags(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_posts_tags_post_id_tag_id ON posts_tags (post_id, tag_id);
CREATE INDEX idx_posts_tags_tag_id ON posts_tags (tag_id);
