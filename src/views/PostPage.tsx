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

const PostPage: FC<PostPageProps> = ({ post }) => {
  return (
    <article>
      <h1>{post.title}</h1>
      {post.description && <p>{post.description}</p>}
      <time datetime={post.inserted_at.toISOString()}>
        {post.inserted_at.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      {post.html_body && (
        <div dangerouslySetInnerHTML={{ __html: post.html_body }} />
      )}
    </article>
  );
};

export default PostPage;
