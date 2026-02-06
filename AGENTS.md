This repo is a TypeScript rewrite of the repo at ~/git/jamiec which is an Elixir project.

The purpose of it is to assist me in sharpening my up JS/TypeScript skils and exposing me to newer modern JS stacks.

Here's the rules:

1. ~/git/jamiec is READONLYYou may only use ~/git/jamiec as READONLY.
1. comment your code. I want to know about idiomatic patterns and decisions.
1. I will put you on a new branch. You do not need to create branches unless explicitally told to do so.
1. Always plan your work and get approval. At the start of each step of the plan before you start working, run the tests. Do not proceeed unless the tests pass.
1. Write the tests ahead of the functionality and then write the functionality so that the tests pass. Never alter tests as a way to fix broken functionality. Test driven development. 
1. Tackle one item of a plan at a time. When the item is complete, run the tests. When the tests pass, commit the code and move onto the next item in the plan.
1. Code should be logically structured according to idiomatic patterns for the stack context and ideally, write as little code as possible.
1. Before creating any new plan you MUST reread AGENTS.md

Here's the high level stack:

* Bun — runtime
* Hono — HTTP framework
* Drizzle — ORM + migrations
* PostgreSQL — database
* Zod — validation
* Redis — caching (when needed)


The aim of a Bun based rebuild is that 

1. the container builds are seconds, not minutes.
1. I take over the source as a learning exercise.
1. The source is as MINIMAL

