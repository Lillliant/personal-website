"use client";

import * as runtime from "react/jsx-runtime";
import type { ComponentPropsWithoutRef } from "react";

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

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
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => {
    // Fenced blocks get a language-* class; leave those unstyled here.
    if (className?.includes("language-")) {
      return <code className={`${className ?? ""} text-code-fg`} {...props} />;
    }
    return (
      <code
        className="rounded bg-code-inline-bg px-1.5 py-0.5 font-mono text-sm text-code-fg"
        {...props}
      />
    );
  },
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="mb-4 overflow-x-auto rounded-lg border border-code-border bg-code-bg p-4 font-mono text-sm text-code-fg"
      {...props}
    />
  ),
};

export function MDXContent({ code, components }: MDXProps) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...mdxComponents, ...components }} />;
}
