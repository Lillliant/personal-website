import { Metadata } from "next";
import Link from "next/link";
import { posts } from "#site/content";
import { formatShortDate } from "@/utils/formatDate";
import BlogFilter from "@/components/blogFilter";
import Pagination from "@/components/pagination";

interface BlogIndexPageProps {
  searchParams: Promise<{
    year?: string;
    tag?: string | string[];
    page?: string;
  }>;
}
export const metadata: Metadata = {
  title: "Blog | Christine Wong",
  description: "Snippets of my thoughts and tech journey.",
};

const POSTS_PER_PAGE = 5;

function normalizeTags(tag: string | string[] | undefined): string[] {
  if (!tag) return [];
  return Array.isArray(tag) ? tag : [tag];
}

export default async function BlogIndexPage({
  searchParams,
}: BlogIndexPageProps) {
  const { year, tag, page } = await searchParams;
  const selectedTags = normalizeTags(tag);

  // 1. Extract unique list of years and tags across all posts
  const allYears = Array.from(new Set(posts.map((p) => p.year)))
    .sort()
    .reverse();
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags || [])),
  ).sort();

  // 2. Filter posts matching active query params (tags use AND), newest first
  const filteredPosts = posts
    .filter((post) => {
      const matchesYear = year ? post.year === year : true;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => post.tags?.includes(t));
      return matchesYear && matchesTags;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
  );

  const requestedPage = Number.parseInt(page ?? "", 10);
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.min(Math.max(requestedPage, 1), totalPages);

  const pageStart = (currentPage - 1) * POSTS_PER_PAGE;
  const visiblePosts = filteredPosts.slice(
    pageStart,
    pageStart + POSTS_PER_PAGE,
  );

  const getPageHref = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    for (const t of selectedTags) {
      params.append("tag", t);
    }
    if (pageNumber > 1) {
      params.set("page", pageNumber.toString());
    }
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  };

  return (
    <main className="flex flex-col">
      <div className="grid grid-rows-2 justify-center items-center text-center pb-5">
        <h1 className="text-3xl font-bold py-1">Christine&apos;s Blog</h1>
        <p>Snippets of my thoughts and tech journey.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 px-4 sm:px-6 md:px-10 pb-10">
        <div className="w-full p-2 md:w-1/4 md:shrink-0 md:border-r md:border-zinc-300 md:pr-8">
          <BlogFilter years={allYears} tags={allTags} />
        </div>
        <div className="w-full min-w-0 flex-1">
          {filteredPosts.length === 0 ? (
            <p className="text-zinc-500 py-6 text-center md:text-left md:px-10">
              No articles found matching criteria.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {visiblePosts.map((post) => (
                <article
                  key={post.slug}
                  className="mx-2 pb-2 border-b border-zinc-300 md:border-b-0"
                >
                  <Link
                    href={post.permalink}
                    className="group block p-4 rounded-lg hover:transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <h2 className="text-2xl font-semibold group-hover:text-amber-500 transition-colors transition-transform group-hover:translate-x-1">
                      {post.title}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                      <time dateTime={post.date}>
                        {formatShortDate(post.date)}
                      </time>
                      <span aria-hidden="true"> · </span>
                      <span>{post.readingTime} min read</span>
                    </p>
                    {post.description && (
                      <p className="my-3">{post.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-3">
                      {post.tags?.map((t) => (
                        <span
                          key={t}
                          className="px-0.5 py-0.5 gap-0.5 tag-pill"
                        >
                          <span className="text-amber-500">#</span>
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                </article>
              ))}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                getPageHref={getPageHref}
                ariaLabel="Blog pagination"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
