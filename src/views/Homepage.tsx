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

// --- Inline SVG icons ---
// Using inline SVGs keeps the project dependency-free and avoids
// needing a static file server for icons.

const LinkedInIcon: FC<{ size?: number }> = ({ size = 80 }) => (
  // LinkedIn brand icon — blue rounded square with "in" mark
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="100" height="100" rx="12" fill="#0A66C2" />
    <path
      d="M25 42h12v38H25V42zm6-19a7 7 0 110 14 7 7 0 010-14zm17 19h11.5v5.2h.2c1.6-3 5.5-6.2 11.3-6.2 12.1 0 14.3 8 14.3 18.3V80H73.5V61.5c0-4.4-.1-10-6.1-10-6.1 0-7 4.8-7 9.7V80H48.5V42z"
      fill="white"
    />
  </svg>
);

const GitHubIcon: FC<{ size?: number }> = ({ size = 80 }) => (
  // GitHub Octocat logo — the familiar cat-in-circle mark
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M50 5C25.1 5 5 25.1 5 50c0 19.9 12.9 36.7 30.8 42.7 2.3.4 3.1-1 3.1-2.2 0-1.1 0-4.1-.1-8-12.5 2.7-15.2-6-15.2-6-2.1-5.2-5-6.6-5-6.6-4.1-2.8.3-2.7.3-2.7 4.5.3 6.9 4.6 6.9 4.6 4 6.9 10.5 4.9 13.1 3.7.4-2.9 1.6-4.9 2.8-6-10-1.1-20.5-5-20.5-22.2 0-4.9 1.8-8.9 4.6-12-.5-1.1-2-5.7.4-11.8 0 0 3.8-1.2 12.3 4.6 3.6-1 7.4-1.5 11.2-1.5 3.8 0 7.6.5 11.2 1.5 8.5-5.8 12.3-4.6 12.3-4.6 2.4 6.1.9 10.7.4 11.8 2.9 3.1 4.6 7.1 4.6 12 0 17.2-10.5 21-20.5 22.1 1.6 1.4 3.1 4.1 3.1 8.3 0 6-.1 10.8-.1 12.3 0 1.2.8 2.6 3.1 2.2C82.1 86.7 95 69.9 95 50 95 25.1 74.9 5 50 5z"
      fill="#292f37"
    />
  </svg>
);

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
        <LinkedInIcon />
      </a>
      <a href="https://github.com/treejamie" aria-label="GitHub">
        <GitHubIcon />
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
          <LinkedInIcon size={100} />
        </a>
        <a href="https://github.com/treejamie" aria-label="GitHub">
          <GitHubIcon size={100} />
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
