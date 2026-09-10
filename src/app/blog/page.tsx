import { Metadata } from "next";
import Link from "next/link";
import { posts } from "#site/content";
import { formatShortDate } from "@/utils/formatDate";
import BlogSidebar from "@/components/blogSideBar";

interface BlogIndexPageProps {
  searchParams: Promise<{
    year?: string;
    tag?: string | string[];
  }>;
}
export const metadata: Metadata = {
  title: "Blog | Lillliant",
};

function normalizeTags(tag: string | string[] | undefined): string[] {
  if (!tag) return [];
  return Array.isArray(tag) ? tag : [tag];
}

export default async function BlogIndexPage({
  searchParams,
}: BlogIndexPageProps) {
  const { year, tag } = await searchParams;
  const selectedTags = normalizeTags(tag);

  // 1. Extract unique list of years and tags across all posts
  const allYears = Array.from(new Set(posts.map((p) => p.year)))
    .sort()
    .reverse();
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || [])),
  ).sort();

  // 2. Filter posts matching active query params (tags use AND)
  const filteredPosts = posts.filter((post) => {
    const matchesYear = year ? post.year === year : true;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((t) => post.tags?.includes(t));
    return matchesYear && matchesTags;
  });

  return (
    <main className="flex flex-col">
      <div className="grid grid-rows-2 justify-center items-center text-center pb-5">
        <h1 className="text-3xl font-bold py-1">Lillliant's Blog</h1>
        <p>Some snippets of my thoughts.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 px-4 sm:px-6 md:px-10">
        <div className="w-full p-2 md:w-1/4 md:shrink-0 md:border-r md:border-zinc-300 md:pr-8">
          <BlogSidebar years={allYears} tags={allTags} />
        </div>
        <div className="w-full min-w-0 flex-1">
          {filteredPosts.length === 0 ? (
            <p className="text-zinc-500 py-6 text-center md:text-left md:px-10">
              No articles found matching criteria.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="mx-2 pb-2 border-b border-zinc-300 md:border-b-0"
                >
                  <Link
                    href={post.permalink}
                    className="block p-4 rounded-lg transition-colors hover:bg-zinc-100"
                  >
                    <h2 className="text-2xl font-semibold hover:text-amber-500">
                      {post.title}
                    </h2>
                    <time
                      dateTime={post.date}
                      className="text-zinc-500 text-sm mb-6 block"
                    >
                      {formatShortDate(post.date)}
                    </time>
                    {post.description && (
                      <p className="text-zinc-700 mt-2">{post.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {post.tags?.map((t) => (
                        <span key={t} className="px-2 py-0.5 gap-0.5 tag-pill">
                          <span className="text-amber-500">#</span>
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
