import { defineConfig, s } from "velite";

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },
  collections: {
    posts: {
      name: "Post",
      pattern: "posts/**/*.{md,mdx}",
      schema: s
        .object({
          slug: s.slug("posts"), // Falls back to filename if not provided
          title: s.string().max(120),
          date: s.isodate(),
          tags: s.array(s.string()).default([]),
          description: s.string().optional(),
          body: s.mdx(),
        })
        .transform((data) => ({
          ...data,
          permalink: `/blog/${data.slug}`,
          year: new Date(data.date).getUTCFullYear().toString(),
        })),
    },
  },
});
