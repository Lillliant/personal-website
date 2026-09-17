import { Metadata } from "next";
import { projects } from "#site/content";
import ProjectIndexContent, { ProjectItem } from "@/components/project/projectIndexContent";

export const metadata: Metadata = {
  title: "Portfolio | Christine Wong",
  description: "A collection of things I have built.",
};

export default function ProjectIndexPage() {
  // Featured projects are pinned to the top, then hand-picked `order`, then
  // anything left over alphabetically
  const sortedProjects: ProjectItem[] = [...projects]
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      if (orderA !== orderB) return orderA - orderB;
      return a.title.localeCompare(b.title);
    })
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      tags: p.tags,
      featured: p.featured,
      order: p.order,
      github: p.github,
      demo: p.demo,
    }));

  return (
    <main className="flex flex-col">
      <div className="grid grid-rows-2 justify-center items-center text-center pb-5">
        <h1 className="text-3xl font-bold py-1">Christine&apos;s Portfolio</h1>
        <p>Some of the things I have built.</p>
      </div>
      <ProjectIndexContent projects={sortedProjects} />
    </main>
  );
}
