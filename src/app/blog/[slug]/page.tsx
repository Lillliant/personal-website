import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { posts } from "#site/content";
import { MDXContent } from "@/components/mdxContent";
import { formatShortDate } from "@/utils/formatDate";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const sortedPosts = [...posts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const postIndex = sortedPosts.findIndex((p) => p.slug === slug);
  const post = postIndex >= 0 ? sortedPosts[postIndex] : undefined;

  if (!post) {
    notFound();
  }

  // Sort by date: prev = newer, next = older
  const prevPost = postIndex > 0 ? sortedPosts[postIndex - 1] : undefined;
  const nextPost =
    postIndex < sortedPosts.length - 1 ? sortedPosts[postIndex + 1] : undefined;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-3/4 mx-10">
        {/* Article content */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 pb-5 transition-colors hover:text-amber-500"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
        <article className="mx-auto pb-10 md:pr-10 md:border-r md:border-zinc-300">
          <p className="text-gray-500 text-sm mb-2">
            <time dateTime={post.date}>{formatShortDate(post.date)}</time>
            <span aria-hidden="true"> · </span>
            <span>{post.readingTime} min read</span>
          </p>
          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <div className="flex flex-wrap gap-3 mb-6">
            {post.tags?.map((t) => (
              <span key={t} className="px-0.5 py-0.5 gap-0.5 tag-pill">
                <span className="text-amber-500">#</span>
                {t}
              </span>
            ))}
          </div>
          <MDXContent code={post.body} />
        </article>
        <nav
          aria-label="Post navigation"
          className="pt-10 pb-10 pr-10 border-t border-zinc-300 md:border-t-0 flex flex-col sm:flex-row sm:justify-between gap-4"
        >
          {prevPost ? (
            <Link
              href={prevPost.permalink}
              className="group flex flex-col gap-1 sm:max-w-[45%] transition-colors hover:text-amber-500"
            >
              <span className="text-xs text-zinc-500 group-hover:text-amber-500">
                <ArrowLeft className="size-4" /> Prev
              </span>
              <span className="text-sm">{prevPost.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextPost ? (
            <Link
              href={nextPost.permalink}
              className="group flex flex-col gap-1 sm:max-w-[45%] sm:text-right sm:items-end transition-colors hover:text-amber-500"
            >
              <span className="text-xs text-zinc-500 group-hover:text-amber-500">
                <ArrowRight className="size-4" /> Next
              </span>
              <span className="text-sm">{nextPost.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
      <div>{/* Table of Content */}</div>
    </div>
  );
}
