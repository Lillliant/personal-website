"use client";

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

/**
 * Shiki fills <code> with token <span>s.
 * Plain `` `inline` `` is only text/number children.
 */
function isShikiCode(children: ReactNode): boolean {
  if (typeof children === "string" || typeof children === "number") return false;
  if (Array.isArray(children)) {
    return children.some(
      (child) => typeof child !== "string" && typeof child !== "number",
    );
  }
  return children != null;
}

const mdxComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold scroll-mt-24" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-8 mb-3 text-2xl font-semibold scroll-mt-24" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-6 mb-2 text-xl font-semibold scroll-mt-24" {...props} />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4 className="mt-4 mb-2 text-lg font-semibold scroll-mt-24" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 leading-7" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-amber-500 underline-offset-2 hover:text-amber-600 hover:underline"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 list-disc space-y-1 pl-6" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 list-decimal space-y-1 pl-6" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mb-4 border-l-2 border-zinc-300 pl-4 italic dark:border-zinc-700"
      {...props}
    />
  ),
  pre: ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className={["mb-4 overflow-x-auto rounded-lg p-4 text-sm font-mono", className]
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
        className={[isShikiWrapper && "rounded px-2 py-[0.2rem] text-xs", className]
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
          !shiki &&
            "rounded bg-code-inline-bg px-2 py-[0.2rem] text-code-fg",
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
    <thead className="border-b border-zinc-300 dark:border-zinc-700" {...props} />
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
