Ensure you've read AGENTS.md

In this work, I want you to actually implement a page for reading a blog post.

The url will contain a slug /post/:slug and you should go fetch the matching post with a status of "PUBLISHED" from the database.

If you cannot find match a slug, or you can but the status isn't PUBLISHED, return a 404.

DOn't worry about style for now.

Just display the title, description, date and the html_content

Write tests to ensure there is a 404 if not found and 200 on if it is was.