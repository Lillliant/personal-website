"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Filter, X } from "lucide-react";

interface BlogSidebarProps {
  years: string[];
  tags: string[];
}

export default function BlogSidebar({ years, tags }: BlogSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedYear = searchParams.get("year");
  const selectedTags = searchParams.getAll("tag");

  const updateYear = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get("year") === value) {
      params.delete("year");
    } else {
      params.set("year", value);
    }

    const query = params.toString();
    router.push(query ? `/blog?${query}` : "/blog");
  };

  const toggleTag = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("tag");

    params.delete("tag");
    const next = current.includes(value)
      ? current.filter((t) => t !== value)
      : [...current, value];

    for (const tag of next) {
      params.append("tag", tag);
    }

    const query = params.toString();
    // Allows for selecting multiple tags for filtering
    router.push(query ? `/blog?${query}` : "/blog");
  };

  const clearAllFilters = () => {
    router.push("/blog");
  };

  const hasActiveFilters = Boolean(selectedYear) || selectedTags.length > 0;
  const activeCount = (selectedYear ? 1 : 0) + selectedTags.length;

  return (
    <aside className="shrink-0">
      {/* Filter button for mobile devices */}
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        className="md:hidden w-full flex items-center justify-between px-4 py-2 rounded-full border border-zinc-200 text-sm font-medium"
        aria-expanded={mobileOpen}
      >
        <span className="inline-flex items-center gap-2">
          <Filter className="size-4 shrink-0" aria-hidden />
          Filters
        </span>
        <span className="inline-flex items-center gap-2">
          {activeCount > 0 && (
            <span className="rounded-full bg-zinc-900 text-white text-xs px-1.5 py-0.5 min-w-5 text-center">
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={`size-4 shrink-0 transition-transform ${mobileOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </span>
      </button>

      {/* Collapsible filter menu for mobile devices */}
      <div
        className={`space-y-6 ${mobileOpen ? "mt-4 block" : "hidden"} md:mt-0 md:block`}
      >
        <div>
          <h3 className="text-sm font-semibold uppercase mb-3 tracking-wider">
            Year
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {years.map((year) => {
              const isActive = selectedYear === year;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => updateYear(year)}
                  className={`w-fit max-w-full text-left px-3 py-1 text-sm rounded-full transition-colors ${
                    isActive
                      ? "bg-amber-400 text-zinc-900 font-medium"
                      : "hover:bg-amber-50 hover:text-zinc-900"
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase mb-3 tracking-wider">
            Tags
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`gap-1 px-2.5 py-1 tag-pill can-hover ${isActive ? "is-active" : ""}`}
                >
                  <span className="text-amber-500">#</span>
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <X className="size-3.5 shrink-0" aria-hidden />
            Clear all
          </button>
        )}
      </div>
    </aside>
  );
}
