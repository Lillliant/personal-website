"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Star } from "lucide-react";
import Pagination from "@/components/pagination";
import { GithubIcon } from "@/components/icons";

export interface ProjectItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
  order?: number;
  github?: string;
  demo?: string;
}

interface ProjectIndexContentProps {
  projects: ProjectItem[];
}

const PROJECTS_PER_PAGE = 6;

export default function ProjectIndexContent({
  projects,
}: ProjectIndexContentProps) {
  const [isBrowsingAll, setIsBrowsingAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync with browser URL on mount and browser back/forward without triggering Next.js prerender bailout
  useEffect(() => {
    const parseUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get("page");
      if (pageParam !== null) {
        setIsBrowsingAll(true);
        const p = Number.parseInt(pageParam, 10);
        setCurrentPage(Number.isNaN(p) || p < 1 ? 1 : p);
      } else {
        setIsBrowsingAll(false);
        setCurrentPage(1);
      }
    };

    parseUrl();
    window.addEventListener("popstate", parseUrl);
    return () => window.removeEventListener("popstate", parseUrl);
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(projects.length / PROJECTS_PER_PAGE),
  );

  const activePage = Math.min(Math.max(currentPage, 1), totalPages);
  const pageStart = isBrowsingAll ? (activePage - 1) * PROJECTS_PER_PAGE : 0;
  const visibleProjects = projects.slice(
    pageStart,
    pageStart + PROJECTS_PER_PAGE,
  );
  const hasOverflow = projects.length > PROJECTS_PER_PAGE;

  const handleViewAll = () => {
    setIsBrowsingAll(true);
    setCurrentPage(2);
    window.history.pushState(null, "", "/project?page=2");
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.history.pushState(null, "", `/project?page=${pageNumber}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 pb-10">
      {projects.length === 0 ? (
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
              <button
                type="button"
                onClick={handleViewAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold tracking-wide rounded-full hover:transition-colors hover:bg-amber-50 dark:hover:bg-amber-50/10 hover:transition-transform hover:duration-300 hover:scale-105 cursor-pointer"
              >
                View all {projects.length} projects
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </button>
            </div>
          )}

          {isBrowsingAll && (
            <Pagination
              currentPage={activePage}
              totalPages={totalPages}
              getPageHref={(p) => `/project?page=${p}`}
              onPageChange={handlePageChange}
              ariaLabel="Project pagination"
            />
          )}
        </>
      )}
    </div>
  );
}
