CREATE TABLE posts (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text,
  markdown_body text,
  html_body text,
  status varchar NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'hidden')),
  inserted_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_status ON posts (status);
CREATE INDEX idx_posts_inserted_at ON posts (inserted_at);
