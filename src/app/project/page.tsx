import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Star } from "lucide-react";
import { projects } from "#site/content";

interface ProjectIndexPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Portfolio | Lillliant",
  description: "A collection of things I have built.",
};

const PROJECTS_PER_PAGE = 6;

// lucide-react has no brand icons
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.07-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A7.995 7.995 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export default async function ProjectIndexPage({
  searchParams,
}: ProjectIndexPageProps) {
  const { page } = await searchParams;

  // Featured projects are pinned to the top, then hand-picked `order`, then
  // anything left over alphabetically
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const orderA = a.order ?? Number.POSITIVE_INFINITY;
    const orderB = b.order ?? Number.POSITIVE_INFINITY;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProjects.length / PROJECTS_PER_PAGE),
  );

  // The page numbers are displayed only when the user clicks "View all" to see everything
  const isBrowsingAll = page !== undefined;
  const requestedPage = Number.parseInt(page ?? "", 10);
  const currentPage = Number.isNaN(requestedPage)
    ? 1
    : Math.min(Math.max(requestedPage, 1), totalPages);

  const pageStart = isBrowsingAll ? (currentPage - 1) * PROJECTS_PER_PAGE : 0;
  const visibleProjects = sortedProjects.slice(
    pageStart,
    pageStart + PROJECTS_PER_PAGE,
  );
  const hasOverflow = sortedProjects.length > PROJECTS_PER_PAGE;

  return (
    <main className="flex flex-col">
      <div className="grid grid-rows-2 justify-center items-center text-center pb-5">
        <h1 className="text-3xl font-bold py-1">Lillliant&apos;s Portfolio</h1>
        <p>Some of the things I have built.</p>
      </div>
      <div className="px-4 sm:px-6 md:px-10 pb-10">
        {sortedProjects.length === 0 ? (
          <p className="text-zinc-500 py-6 text-center">No projects yet.</p>
        ) : (
          <>
            <div className="mx-auto max-w-5xl grid gap-5 sm:grid-cols-2">
              {visibleProjects.map((project) => {
                // The title points at whatever is the most interesting to visit
                const primaryLink = project.demo ?? project.github;

                return (
                  <article
                    key={project.slug}
                    className="group flex flex-col gap-3 p-5 rounded-lg hover:transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-2xl font-semibold group-hover:text-amber-500 transition-colors transition-transform group-hover:translate-x-1">
                        {primaryLink ? (
                          <a
                            href={primaryLink}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:transition-colors hover:text-amber-500"
                          >
                            {project.title}
                          </a>
                        ) : (
                          project.title
                        )}
                      </h2>
                      {project.featured && (
                        <span
                          className="inline-flex items-center gap-1 shrink-0 px-2 py-0.5 text-amber-500"
                          title="Featured project"
                        >
                          <Star
                            className="size-3.5 shrink-0"
                            aria-hidden
                          />
                          <span className="text-xs font-bold">Featured</span>
                        </span>
                      )}
                    </div>

                    <p className="flex-1">{project.description}</p>

                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {project.tags.map((t) => (
                          <span
                            key={t}
                            className="px-0.5 py-0.5 gap-0.5 tag-pill"
                          >
                            <span className="text-amber-500">#</span>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* A project has a repository, a live demo, or both */}
                    {(project.github || project.demo) && (
                      <div className="flex flex-wrap items-center gap-4 pt-1 text-sm">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 hover:transition-colors hover:text-amber-500"
                          >
                            <GithubIcon className="size-4 shrink-0" />
                            Source
                            <span className="sr-only">
                              {" "}
                              code for {project.title} on GitHub
                            </span>
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 hover:transition-colors hover:text-amber-500"
                          >
                            <ExternalLink
                              className="size-4 shrink-0"
                              aria-hidden
                            />
                            Live demo
                            <span className="sr-only"> of {project.title}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Only the first page is shown until "View all" opens up the rest */}
            {!isBrowsingAll && hasOverflow && (
              <div className="flex justify-center pt-8">
                <Link
                  href="/project?page=1"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full border border-zinc-300 dark:border-zinc-700 hover:transition-colors hover:bg-amber-50 dark:hover:bg-amber-50/10"
                >
                  View all {sortedProjects.length} projects
                  <ArrowRight className="size-4 shrink-0" aria-hidden />
                </Link>
              </div>
            )}

            {isBrowsingAll && totalPages > 1 && (
              <nav
                aria-label="Project pagination"
                className="flex items-center justify-center gap-1.5 pt-8 text-sm"
              >
                {currentPage > 1 ? (
                  <Link
                    href={`/project?page=${currentPage - 1}`}
                    rel="prev"
                    aria-label="Previous page"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full hover:transition-colors hover:bg-amber-50 dark:hover:bg-amber-50/40 dark:hover:text-zinc-900"
                  >
                    <ArrowLeft className="size-4 shrink-0" aria-hidden />
                    Prev
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-zinc-300 dark:text-zinc-700">
                    <ArrowLeft className="size-4 shrink-0" aria-hidden />
                    Prev
                  </span>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => {
                    const isCurrent = pageNumber === currentPage;
                    return (
                      <Link
                        key={pageNumber}
                        href={`/project?page=${pageNumber}`}
                        aria-label={`Page ${pageNumber}`}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`min-w-8 text-center px-3 py-1 rounded-full hover:transition-colors ${
                          isCurrent
                            ? "bg-amber-400 dark:bg-amber-400/85 dark:text-zinc-900 font-medium"
                            : "hover:bg-amber-50 dark:hover:bg-amber-50/40 dark:hover:text-zinc-900"
                        }`}
                      >
                        {pageNumber}
                      </Link>
                    );
                  },
                )}

                {currentPage < totalPages ? (
                  <Link
                    href={`/project?page=${currentPage + 1}`}
                    rel="next"
                    aria-label="Next page"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full hover:transition-colors hover:bg-amber-50 dark:hover:bg-amber-50/40 dark:hover:text-zinc-900"
                  >
                    Next
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-zinc-300 dark:text-zinc-700">
                    Next
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </span>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}
