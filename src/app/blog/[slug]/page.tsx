import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { posts } from "#site/content";
import { MDXContent } from "@/components/blog/mdxContent";
import { BlogTableOfContents } from "@/components/blog/blogTableOfContent";
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
    <div>
      <div className="lg:w-4/5 pl-10 lg:pl-20 lg:pr-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 pb-5 transition-colors hover:text-amber-500"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-4/5 pl-10 lg:pl-20 lg:pr-10">
          <article className="mx-auto pb-10 pr-12 lg:pr-10 h-full lg:border-r lg:border-zinc-300 lg:dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">
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
        </div>

        {post.toc.length > 0 && (
          <div className="hidden lg:block lg:w-1/5">
            <BlogTableOfContents entries={post.toc} />
          </div>
        )}
      </div>

      <nav
        aria-label="Post navigation"
        className="lg:w-4/5 pl-10 lg:pl-20 lg:pr-20 pt-10 pb-10 pr-10 border-t border-zinc-300 md:border-t-0 flex flex-col sm:flex-row sm:justify-between gap-4 text-zinc-500 dark:text-zinc-400"
      >
        {/* For moving across posts, prev = newer, next = older */}
        {prevPost ? (
          <Link
            href={prevPost.permalink}
            className="flex flex-col gap-1 sm:max-w-[45%] hover:transition-colors hover:text-amber-500"
          >
            <span className="text-xs">
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
            className="flex flex-col gap-1 sm:max-w-[45%] sm:text-right sm:items-end hover:transition-colors hover:text-amber-500"
          >
            <span className="text-xs">
              <ArrowRight className="size-4" /> Next
            </span>
            <span className="text-sm">{nextPost.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
