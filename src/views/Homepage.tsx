// @jsxImportSource hono/jsx

/**
 * Homepage.tsx — The homepage matching the Figma design.
 *
 * This is a Hono JSX component. It looks like React but runs entirely
 * on the server — the JSX is compiled to HTML strings, not a virtual DOM.
 *
 * Hono's `FC` (Function Component) type works like React's FC.
 * You can use `class` instead of `className` since it renders to raw HTML.
 *
 * The page has four sections:
 *   1. Hero — name, subtitle, social links
 *   2. Posts — recent posts list (hardcoded for now)
 *   3. Timeline — visual timeline (placeholder)
 *   4. Bio/Footer — photo, bio text, social links
 */

import type { FC } from "hono/jsx";

// --- Post data type ---
// Hardcoded for now — later this will come from the database.
interface Post {
  title: string;
  date: string;
  tag: string;
  tagColor: string;
}

// Placeholder posts matching the Figma design
const posts: Post[] = [
  {
    title: "Europe LTD - How Legislation is crafted in Europe.",
    date: "6th January 2026",
    tag: "privacy",
    tagColor: "#fcb700",
  },
  {
    title: "AI Development. Finally, I don't need to type.",
    date: "2nd January 2026",
    tag: "engineering",
    tagColor: "#00d3bb",
  },
];

// --- Section components ---

/** Hero section: large name, subtitle, and social icons */
const Hero: FC = () => (
  <section class="section hero">
    <div class="hero__text">
      <h1 class="heading-xl">Jamie Curle</h1>
      <p class="subtitle">
        Lead Software Engineer specialising in Elixir, privacy engineering, and
        security-first systems. Part-time arborist and aspiring woodsman.
      </p>
    </div>
    <div class="hero__social">
      <a href="https://linkedin.com/in/jamiecurle" aria-label="LinkedIn">
        <img src="/static/linkedin.svg" alt="LinkedIn" width={80} height={80} />
      </a>
      <a href="https://github.com/treejamie" aria-label="GitHub">
        <img src="/static/github.svg" alt="GitHub" width={80} height={80} />
      </a>
    </div>
  </section>
);

/** A single post entry in the posts list */
const PostEntry: FC<{ post: Post }> = ({ post }) => (
  <article class="post-entry">
    <div class="post-entry__header">
      <div>
        <h3 class="post-entry__title">{post.title}</h3>
        <p class="post-entry__date">{post.date}</p>
      </div>
      {/* Badge uses currentColor so the border matches the text */}
      <span class="badge" style={{ color: post.tagColor }}>
        {post.tag}
      </span>
    </div>
  </article>
);

/** Posts section: dark background with heading on left, posts on right */
const Posts: FC = () => (
  <section class="section section--dark">
    <div class="section__grid">
      <h2 class="heading-xl">posts</h2>
      <div class="post-list">
        {/* Map over posts array — same pattern as React's list rendering */}
        {posts.map((post) => (
          <PostEntry post={post} />
        ))}
      </div>
    </div>
  </section>
);

/** Timeline section: visual timeline with dots and a connecting line */
const Timeline: FC = () => (
  <section class="section">
    <div class="section__grid">
      <h2 class="heading-xl">timeline</h2>
      {/*
        The timeline is a vertical line with dots.
        The red dot and branch represent the current position.
        This is a visual placeholder — will be data-driven later.
      */}
      <div class="timeline">
        <div class="timeline__line" />
        <div class="timeline__dot" />
        <div class="timeline__dot--active timeline__dot" />
        <div class="timeline__dot" />
      </div>
    </div>
  </section>
);

/** Bio/footer section: photo, bio text, and social links */
const Bio: FC = () => (
  <section class="section section--dark">
    <div class="bio">
      {/*
        Profile photo pulled directly from GitHub's avatar service.
        No need to host the image ourselves — GitHub serves it reliably.
      */}
      <img
        class="bio__photo"
        src="https://github.com/treejamie.png"
        alt="Jamie Curle"
        width={268}
        height={274}
      />
      <div class="bio__text">
        <p>
          <strong>Jamie Curle</strong> is a{" "}
          <b>privacy focused technology professional</b> and founder. Currently
          he's working at Privacy Posture leading the design, development and
          deployment of privacy focused engineering tools to market.
        </p>
        <p>
          He's a qualified ISO27001 lead implementer and has held CTO and CIO
          positions in an multi-award winning global startup.
        </p>
        <p>
          He spend his spare time working with trees, either in woodworking,
          arboriculture or woodland management.
        </p>
      </div>
      <div class="bio__social">
        <a href="https://linkedin.com/in/jamiecurle" aria-label="LinkedIn">
          <img src="/static/linkedin.svg" alt="LinkedIn" width={100} height={100} />
        </a>
        <a href="https://github.com/treejamie" aria-label="GitHub">
          <img src="/static/github.svg" alt="GitHub" width={100} height={100} />
        </a>
      </div>
    </div>
  </section>
);

// --- Main Homepage component ---

/**
 * The Homepage composes all four sections together.
 *
 * In Hono JSX, this is just a function that returns JSX.
 * When passed to c.html(), Hono serialises it to an HTML string
 * and sends it as the response body.
 */
const Homepage: FC = () => (
  <>
    <Hero />
    <Posts />
    <Timeline />
    <Bio />
  </>
);

export default Homepage;
