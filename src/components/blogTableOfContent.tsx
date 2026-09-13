"use client";

import { useEffect, useRef, useState } from "react";

export interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

interface TocListProps {
  entries: TocEntry[];
  depth?: number;
  activeUrl?: string | null;
  pinnedDepth?: number;
}

// Keep the active link clear of the rail's faded edges (`toc-rail` in globals.css).
const FADE_HEIGHT = 32;

function flattenEntries(entries: TocEntry[]): TocEntry[] {
  return entries.flatMap((entry) => [entry, ...flattenEntries(entry.items)]);
}

function containsUrl(entry: TocEntry, url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    entry.url === url || entry.items.some((item) => containsUrl(item, url))
  );
}

// The depth of the first level that actually branches.
function findPinnedDepth(entries: TocEntry[]): number {
  let depth = 0;
  let level = entries;

  while (level.length === 1 && level[0].items.length > 0) {
    level = level[0].items;
    depth += 1;
  }

  return depth;
}

function TocLink({ item, isActive }: { item: TocEntry; isActive: boolean }) {
  return (
    <a
      href={item.url}
      className={`block hover:text-amber-500 ${
        isActive ? "font-bold" : ""
      }`}
      aria-current={isActive ? "location" : undefined}
    >
      {item.title}
    </a>
  );
}

// The nested list of headings, with the active section unfolded.
export function TocList({
  entries,
  depth = 0,
  activeUrl,
  pinnedDepth = 0,
}: TocListProps) {
  if (entries.length === 0) return null;

  return (
    <ul
      className={
        depth === 0
          ? "space-y-2 text-sm"
          : "mt-2 space-y-2.5 border-l-[0.75px] border-zinc-300 dark:border-zinc-700 pl-3"
      }
    >
      {entries.map((item) => {
        const isActive = item.url === activeUrl;
        const child = (
          <TocList
            entries={item.items}
            depth={depth + 1}
            activeUrl={activeUrl}
            pinnedDepth={pinnedDepth}
          />
        );

        if (item.items.length === 0 || depth < pinnedDepth) {
          return (
            <li key={item.url}>
              <TocLink item={item} isActive={isActive} />
              {child}
            </li>
          );
        }

        // Subheadings are hidden unless the section is active or contains the active heading.
        const isOpen = containsUrl(item, activeUrl);

        return (
          <li key={item.url}>
            <TocLink item={item} isActive={isActive} />
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
              inert={!isOpen}
            >
              <div className="overflow-hidden">{child}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// The formatted table of contents rail
export function BlogTableOfContents({ entries }: { entries: TocEntry[] }) {
  const railRef = useRef<HTMLElement>(null);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [fadeStart, setFadeStart] = useState(false);
  const [fadeEnd, setFadeEnd] = useState(false);

  useEffect(() => {
    const headings = flattenEntries(entries)
      .map((entry) => {
        const id = entry.url.startsWith("#")
          ? decodeURIComponent(entry.url.slice(1))
          : entry.url;
        return {
          entry,
          element: document.getElementById(id),
        };
      })
      .filter(
        (
          heading,
        ): heading is {
          entry: TocEntry;
          element: HTMLElement;
        } => heading.element instanceof HTMLElement,
      );

    if (headings.length === 0) return;

    let frame = 0;
    const updateActiveHeading = () => {
      const readingOffset = 120;
      let current = headings[0];

      for (const heading of headings) {
        if (heading.element.getBoundingClientRect().top <= readingOffset) {
          current = heading;
        } else {
          break;
        }
      }

      setActiveUrl(current.entry.url);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveHeading);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [entries]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const sync = () => {
      const railBox = rail.getBoundingClientRect();
      const activeLink = activeUrl
        ? rail.querySelector(`a[href="${CSS.escape(activeUrl)}"]`)
        : null;

      // If the active link is above the rail's visible area, scroll the rail down to bring it into view.
      if (activeLink) {
        const linkBox = activeLink.getBoundingClientRect();

        if (linkBox.top < railBox.top + FADE_HEIGHT) {
          rail.scrollTop += linkBox.top - railBox.top - FADE_HEIGHT;
        } else if (linkBox.bottom > railBox.bottom - FADE_HEIGHT) {
          rail.scrollTop += linkBox.bottom - railBox.bottom + FADE_HEIGHT;
        }
      }

      const scrollable = rail.scrollHeight - rail.clientHeight;
      setFadeStart(rail.scrollTop > 1);
      setFadeEnd(rail.scrollTop < scrollable - 1);
    };

    sync();
    rail.addEventListener("scroll", sync, { passive: true });

    // Re-runs the unfold animation to keep tracking the active link while the rail's content changes height.
    const observer = new ResizeObserver(sync);
    observer.observe(rail);
    if (rail.firstElementChild) observer.observe(rail.firstElementChild);

    return () => {
      rail.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [activeUrl, entries]);

  return (
    <aside className="sticky top-24 w-full px-2 pr-10">
      <p className="pb-4 text-left text-sm font-semibold uppercase tracking-wider text-amber-600">
        On this page
      </p>
      <nav
        ref={railRef}
        aria-label="Table of contents"
        className="toc-rail max-h-[calc(100dvh-11rem)] overflow-y-auto overscroll-contain"
        data-fade-start={fadeStart}
        data-fade-end={fadeEnd}
      >
        <TocList
          entries={entries}
          activeUrl={activeUrl}
          pinnedDepth={findPinnedDepth(entries)}
        />
      </nav>
    </aside>
  );
}
