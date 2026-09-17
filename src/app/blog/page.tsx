import { Metadata } from "next";
import { posts } from "#site/content";
import BlogIndexContent, { PostSummary } from "@/components/blogIndexContent";

export const metadata: Metadata = {
  title: "Blog | Christine Wong",
  description: "Snippets of my thoughts and tech journey.",
};

export default function BlogIndexPage() {
  const allYears = Array.from(new Set(posts.map((p) => p.year)))
    .sort()
    .reverse();
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || [])),
  ).sort();

  const postSummaries: PostSummary[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    year: post.year,
    readingTime: post.readingTime,
    description: post.description,
    tags: post.tags,
    permalink: post.permalink,
  }));

  return (
    <main className="flex flex-col">
      <div className="grid grid-rows-2 justify-center items-center text-center pb-5">
        <h1 className="text-3xl font-bold py-1">Christine&apos;s Blog</h1>
        <p>Snippets of my thoughts and tech journey.</p>
      </div>
      <BlogIndexContent
        posts={postSummaries}
        allYears={allYears}
        allTags={allTags}
      />
    </main>
  );
}
