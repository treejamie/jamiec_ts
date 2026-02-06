Ensure you've read AGENTS.md

In this work we're going to setup the database and implement the post schema using Drizzle as the ORM and migrations. We're going to use Postgres.

You should copy the data structures from the "content" context of the source project (posts and tags) and write migrations for them.

You should also ensure that the tests enforce all of the constraints from the database and from the elixir changesets and implement them in this repository using standard idiomatic patterns for the drizzle, bun and hono.

