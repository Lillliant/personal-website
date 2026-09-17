import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import { projects } from "#site/content";
import Pagination from "@/components/pagination";
import { GithubIcon } from "@/components/icons";

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
                  href="/project?page=2"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold tracking-wide rounded-full hover:transition-colors hover:bg-amber-50 dark:hover:bg-amber-50/10 hover:transition-transform hover:duration-300 hover:scale-105"
                >
                  View all {sortedProjects.length} projects
                  <ArrowRight className="size-4 shrink-0" aria-hidden />
                </Link>
              </div>
            )}

            {isBrowsingAll && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                getPageHref={(page) => `/project?page=${page}`}
                ariaLabel="Project pagination"
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
