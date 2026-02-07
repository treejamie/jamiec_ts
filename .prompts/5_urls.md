Ensure you've read AGENTS.md

In this work, we're going to add some URLS.

Duplicate these the URLS from the source project into this project.


* health check - /health
* post view = /post/:post-slug
* office post list = /office/posts - list of all posts regardless of status
* office post edit / create = /office/posts/edit|create - form for editing


As for the content returned just return a 200 with "hello" for now.


At somepoint soon we will add auth into all /office routes, but that's not now.


Ensure you write tests to ensure all endpoints return 200.


