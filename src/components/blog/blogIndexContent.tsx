"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatShortDate } from "@/utils/formatDate";
import BlogFilter from "@/components/blog/blogFilter";
import Pagination from "@/components/ui/pagination";

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  year: string;
  readingTime: number;
  description?: string;
  tags?: string[];
  permalink: string;
}

interface BlogIndexContentProps {
  posts: PostSummary[];
  allYears: string[];
  allTags: string[];
}

const POSTS_PER_PAGE = 5;

export default function BlogIndexContent({
  posts,
  allYears,
  allTags,
}: BlogIndexContentProps) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Sync with browser URL on mount and browser back/forward without triggering Next.js prerender bailout
  useEffect(() => {
    const parseUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const yearParam = params.get("year");
      const tagParams = params.getAll("tag");
      const pageParam = Number.parseInt(params.get("page") ?? "1", 10);

      setSelectedYear(yearParam);
      setSelectedTags(tagParams);
      setCurrentPage(Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam);
    };

    parseUrl();
    window.addEventListener("popstate", parseUrl);
    return () => window.removeEventListener("popstate", parseUrl);
  }, []);

  const updateUrl = (year: string | null, tags: string[], page: number) => {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    for (const t of tags) params.append("tag", t);
    if (page > 1) params.set("page", page.toString());
    const query = params.toString();
    const newUrl = query ? `/blog?${query}` : "/blog";
    window.history.pushState(null, "", newUrl);
  };

  const handleSelectYear = (value: string) => {
    const nextYear = selectedYear === value ? null : value;
    setSelectedYear(nextYear);
    setCurrentPage(1);
    updateUrl(nextYear, selectedTags, 1);
  };

  const handleToggleTag = (value: string) => {
    const nextTags = selectedTags.includes(value)
      ? selectedTags.filter((t) => t !== value)
      : [...selectedTags, value];
    setSelectedTags(nextTags);
    setCurrentPage(1);
    updateUrl(selectedYear, nextTags, 1);
  };

  const handleClearAll = () => {
    setSelectedYear(null);
    setSelectedTags([]);
    setCurrentPage(1);
    updateUrl(null, [], 1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    updateUrl(selectedYear, selectedTags, pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter posts matching active query params (tags use OR), newest first
  const filteredPosts = posts
    .filter((post) => {
      const matchesYear = selectedYear ? post.year === selectedYear : true;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((t) => post.tags?.includes(t));
      return matchesYear && matchesTags;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
  );

  const activePage = Math.min(Math.max(currentPage, 1), totalPages);
  const pageStart = (activePage - 1) * POSTS_PER_PAGE;
  const visiblePosts = filteredPosts.slice(
    pageStart,
    pageStart + POSTS_PER_PAGE,
  );

  const getPageHref = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (selectedYear) params.set("year", selectedYear);
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
    <div className="mx-auto max-w-5xl w-full flex flex-col md:flex-row gap-6 md:gap-10 px-4 sm:px-6 md:px-10 pb-10">
      <div className="w-full p-2 md:w-1/4 md:shrink-0 md:border-r md:border-zinc-300 md:pr-8">
        <BlogFilter
          years={allYears}
          tags={allTags}
          selectedYear={selectedYear}
          selectedTags={selectedTags}
          onSelectYear={handleSelectYear}
          onToggleTag={handleToggleTag}
          onClearAll={handleClearAll}
        />
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
              currentPage={activePage}
              totalPages={totalPages}
              getPageHref={getPageHref}
              onPageChange={handlePageChange}
              ariaLabel="Blog pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
}
