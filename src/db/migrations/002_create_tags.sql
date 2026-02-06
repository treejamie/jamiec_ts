CREATE TABLE tags (
  id serial PRIMARY KEY,
  tag varchar NOT NULL,
  slug varchar NOT NULL UNIQUE
);
