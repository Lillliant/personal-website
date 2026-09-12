import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import remarkSmartypants from "remark-smartypants";
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
          metadata: s.metadata(),
          body: s.mdx(),
          toc: s.toc(),
        })
        .transform((data) => ({
          ...data,
          permalink: `/blog/${data.slug}`,
          year: new Date(data.date).getUTCFullYear().toString(),
          readingTime: data.metadata.readingTime,
        })),
    },
  },
  mdx: {
    remarkPlugins: [[remarkSmartypants, { dashes: "oldschool" }]],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeShiki as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        {
          theme: "rose-pine",
          defaultLanguage: "text",
          fallbackLanguage: "text",
          // Inline: `print("hello"){:python}` for highlighting
          inline: "tailing-curly-colon",
        },
      ],
    ],
  },
});
