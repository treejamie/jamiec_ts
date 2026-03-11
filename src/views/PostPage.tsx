// @jsxImportSource hono/jsx

import type { FC } from "hono/jsx";

interface PostPageProps {
  post: {
    title: string;
    description: string | null;
    html_body: string | null;
    inserted_at: Date;
  };
}

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const PostPage: FC<PostPageProps> = ({ post }) => {
  const readTime = post.html_body ? estimateReadTime(post.html_body) : 1;

  return (
    <div class="post-page">
      <article class="post">
        <h1 class="post__title">{post.title}</h1>
        {post.description && <p class="post__subtitle">{post.description}</p>}
        <time class="post__meta" datetime={post.inserted_at.toISOString()}>
          {post.inserted_at.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · "}
          {readTime} min read
        </time>
        {post.html_body && (
          <div
            class="post__body"
            dangerouslySetInnerHTML={{ __html: post.html_body }}
          />
        )}
      </article>
    </div>
  );
};

export default PostPage;
