"use client";

import { ChevronRight } from "lucide-react";
import * as runtime from "react/jsx-runtime";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

// Checks if the children of a <code> element are Shiki-rendered code
function isShikiCode(children: ReactNode): boolean {
  if (typeof children === "string" || typeof children === "number")
    return false;
  if (Array.isArray(children)) {
    return children.some(
      (child) => typeof child !== "string" && typeof child !== "number",
    );
  }
  return children != null;
}

// Helper function to check if a prop exists on an object, since some props are injected by GFM and not explicitly defined in the TSX.
function hasDataAttr(props: object, name: string): boolean {
  return Object.prototype.hasOwnProperty.call(props, name);
}

const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold scroll-mt-24" {...props} />
  ),
  h2: ({ className, id, ...props }: ComponentPropsWithoutRef<"h2">) => {
    // GFM injects <h2 id="footnote-label" class="sr-only">Footnotes</h2>.
    // Hide it here so the label never shows (and `sr-only` is present in source).
    if (id === "footnote-label") {
      return <h2 id={id} className="sr-only" {...props} />;
    }
    return (
      <h2
        id={id}
        className={["mt-8 mb-3 text-2xl font-semibold scroll-mt-24", className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-6 mb-2 text-xl font-semibold scroll-mt-24" {...props} />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4 className="mt-4 mb-2 text-lg font-semibold scroll-mt-24" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 leading-7" {...props} />
  ),
  a: ({ className, ...props }: ComponentPropsWithoutRef<"a">) => {
    const isFootnoteRef = hasDataAttr(props, "data-footnote-ref");
    const isFootnoteBackref = hasDataAttr(props, "data-footnote-backref");

    return (
      <a
        className={[
          isFootnoteRef
            ? "text-amber-600 no-underline hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400"
            : isFootnoteBackref
              ? "ml-1 inline-flex no-underline text-zinc-400 hover:text-amber-500 dark:text-zinc-500"
              : "text-amber-500 underline-offset-2 hover:text-amber-600 hover:underline",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 list-disc space-y-1 pl-6" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 list-decimal space-y-1 pl-6" {...props} />
  ),
  li: ({ id, className, ...props }: ComponentPropsWithoutRef<"li">) => {
    const isFootnote = id?.startsWith("user-content-fn-");
    return (
      <li
        id={id}
        className={[
          isFootnote
            ? "scroll-mt-24 leading-6 target:rounded-sm target:bg-amber-50 dark:target:bg-amber-950/40"
            : "leading-7",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mb-4 border-l-2 border-zinc-300 pl-4 italic dark:border-zinc-700"
      {...props}
    />
  ),
  details: ({ className, ...props }: ComponentPropsWithoutRef<"details">) => (
    <details
      className={[
        "group mb-4 rounded-lg border border-zinc-200 px-4 dark:border-zinc-800",
        "[interpolate-size:allow-keywords]",
        "[&::details-content]:h-0 [&::details-content]:overflow-hidden",
        "[&::details-content]:transition-[height,content-visibility] [&::details-content]:duration-300 [&::details-content]:ease-out",
        "[&::details-content]:[transition-behavior:allow-discrete] open:[&::details-content]:h-auto",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
  summary: ({
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<"summary">) => (
    <summary
      className={[
        "flex cursor-pointer list-none items-center gap-2 py-3 font-medium",
        "[&::-webkit-details-marker]:hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-90"
      />
      <span>{children}</span>
    </summary>
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr
      className="my-8 border-0 border-t border-zinc-200 dark:border-zinc-800"
      {...props}
    />
  ),
  // GFM footnote reference marker
  sup: ({ className, ...props }: ComponentPropsWithoutRef<"sup">) => (
    <sup
      className={[
        "ms-0.5 text-[0.7em] font-medium leading-none text-amber-600 dark:text-amber-500",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
  // For styling GFM footnote footer
  section: ({ className, ...props }: ComponentPropsWithoutRef<"section">) => {
    const isFootnotes =
      className?.split(/\s+/).includes("footnotes") ||
      hasDataAttr(props, "data-footnotes");

    return (
      <section
        className={[
          isFootnotes &&
            [
              "mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-600",
              "dark:border-zinc-800 dark:text-zinc-400",
              // Override default ol/p spacing inside the footnote list
              "[&>ol]:!mb-0 [&>ol]:!space-y-1 [&>ol]:!pl-5",
              "[&_li>p]:!mb-0 [&_li>p]:!inline",
            ].join(" "),
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
  pre: ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className={[
        "mb-4 overflow-x-auto rounded-lg p-4 text-sm font-mono whitespace-pre-wrap break-words",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
  // Shiki inline highlights use <span class="shiki">
  span: ({ className, ...props }: ComponentPropsWithoutRef<"span">) => {
    const isShikiWrapper = className?.split(/\s+/).includes("shiki") ?? false;
    return (
      <span
        className={[
          isShikiWrapper && "rounded px-2 py-[0.2rem] text-xs",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
  code: ({
    className,
    children,
    ...props
  }: ComponentPropsWithoutRef<"code">) => {
    const shiki = isShikiCode(children);

    return (
      <code
        className={[
          "font-mono text-sm",
          !shiki && "rounded bg-code-inline-bg px-2 py-[0.2rem] text-code-fg",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </code>
    );
  },
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="mb-4 w-full overflow-x-auto">
      <table
        className="w-full border-collapse text-sm max-md:min-w-max md:table-fixed"
        {...props}
      />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead
      className="border-b border-zinc-300 dark:border-zinc-700"
      {...props}
    />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
    <tbody
      className="divide-y divide-zinc-200 dark:divide-zinc-800"
      {...props}
    />
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => <tr {...props} />,
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-3 py-2 text-left align-top font-semibold break-words max-md:whitespace-nowrap"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="px-3 py-2 align-top break-words" {...props} />
  ),
};

export function MDXContent({ code, components }: MDXProps) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...mdxComponents, ...components }} />;
}
