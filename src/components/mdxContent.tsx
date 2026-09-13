"use client";

import {
  CircleAlert,
  CircleCheck,
  CircleHelp,
  ChevronRight,
  Info,
  Lightbulb,
  ShieldAlert,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import * as runtime from "react/jsx-runtime";
import {
  Children,
  cloneElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";

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

type MarkColor = "red" | "yellow" | "green" | "blue" | "purple";

const markColorClasses: Record<MarkColor, string> = {
  red: "bg-red-200/80 text-red-950 dark:bg-red-900/60 dark:text-red-100",
  yellow:
    "bg-yellow-200/80 text-yellow-950 dark:bg-yellow-900/60 dark:text-yellow-100",
  green:
    "bg-green-200/80 text-green-950 dark:bg-green-900/60 dark:text-green-100",
  blue: "bg-blue-200/80 text-blue-950 dark:bg-blue-900/60 dark:text-blue-100",
  purple:
    "bg-purple-200/80 text-purple-950 dark:bg-purple-900/60 dark:text-purple-100",
};

type CalloutType =
  | "note"
  | "tip"
  | "important"
  | "warning"
  | "caution"
  | "info"
  | "danger";

interface CalloutConfig {
  title: string;
  icon: LucideIcon;
  className: string;
  headingClassName: string;
}

const calloutConfigs: Record<CalloutType, CalloutConfig> = {
  note: {
    title: "Note",
    icon: CircleHelp,
    className:
      "border-blue-200 bg-blue-50/80 text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
    headingClassName: "text-blue-700 dark:text-blue-300",
  },
  tip: {
    title: "Tip",
    icon: Lightbulb,
    className:
      "border-emerald-200 bg-emerald-50/80 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
    headingClassName: "text-emerald-700 dark:text-emerald-300",
  },
  important: {
    title: "Important",
    icon: CircleCheck,
    className:
      "border-violet-200 bg-violet-50/80 text-violet-950 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
    headingClassName: "text-violet-700 dark:text-violet-300",
  },
  warning: {
    title: "Warning",
    icon: TriangleAlert,
    className:
      "border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
    headingClassName: "text-amber-700 dark:text-amber-300",
  },
  caution: {
    title: "Caution",
    icon: CircleAlert,
    className:
      "border-orange-200 bg-orange-50/80 text-orange-950 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-100",
    headingClassName: "text-orange-700 dark:text-orange-300",
  },
  info: {
    title: "Info",
    icon: Info,
    className:
      "border-cyan-200 bg-cyan-50/80 text-cyan-950 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-100",
    headingClassName: "text-cyan-700 dark:text-cyan-300",
  },
  danger: {
    title: "Danger",
    icon: ShieldAlert,
    className:
      "border-red-200 bg-red-50/80 text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100",
    headingClassName: "text-red-700 dark:text-red-300",
  },
};

interface ParsedCallout {
  type: CalloutType;
  title?: string;
  children: ReactNode[];
}

function parseCallout(children: ReactNode): ParsedCallout | null {
  const blockChildren = Children.toArray(children);
  const paragraphIndex = blockChildren.findIndex(isValidElement);

  if (paragraphIndex === -1) return null;

  const paragraph = blockChildren[paragraphIndex] as ReactElement<{
    children?: ReactNode;
  }>;
  const paragraphChildren = Children.toArray(paragraph.props.children);
  const firstTextIndex = paragraphChildren.findIndex(
    (child) => typeof child === "string",
  );

  if (firstTextIndex === -1) return null;

  const firstText = paragraphChildren[firstTextIndex] as string;
  const match = firstText.match(
    /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO|DANGER)\](?:[ \t]+([^\n]+))?(?:\n|$)/i,
  );

  if (!match) return null;

  const remainingText = firstText.slice(match[0].length);
  const remainingParagraphChildren = [...paragraphChildren];
  remainingParagraphChildren[firstTextIndex] = remainingText;

  const hasParagraphContent = remainingParagraphChildren.some(
    (child) => typeof child !== "string" || child.trim().length > 0,
  );
  const nextBlockChildren = [...blockChildren];

  if (hasParagraphContent) {
    nextBlockChildren[paragraphIndex] = cloneElement(paragraph, {
      children: remainingParagraphChildren,
    });
  } else {
    nextBlockChildren.splice(paragraphIndex, 1);
  }

  return {
    type: match[1].toLowerCase() as CalloutType,
    title: match[2]?.trim(),
    children: nextBlockChildren,
  };
}

function Blockquote({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"blockquote">) {
  const callout = parseCallout(children);

  if (!callout) {
    return (
      <blockquote
        className={[
          "mb-4 border-l-2 border-zinc-300 pl-4 italic dark:border-zinc-700",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </blockquote>
    );
  }

  const config = calloutConfigs[callout.type];
  const Icon = config.icon;
  const title = callout.title ?? config.title;

  return (
    <aside
      aria-label={`${title} callout`}
      className={[
        "mb-4 rounded-lg border px-4 py-3",
        "[&>p]:mb-3 [&>p:last-child]:mb-0",
        "[&>ul]:mb-3 [&>ol]:mb-3",
        config.className,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "mb-2 flex items-center gap-2 font-semibold",
          config.headingClassName,
        ].join(" ")}
      >
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        <span>{title}</span>
      </div>
      {callout.children}
    </aside>
  );
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
            ? "ms-0.5 font-medium text-amber-600 no-underline hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400"
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
  blockquote: Blockquote,
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
  mark: ({
    className,
    ...props
  }: ComponentPropsWithoutRef<"mark"> & { "data-color"?: MarkColor }) => {
    const color = props["data-color"];
    const colorClass =
      markColorClasses[color ?? "yellow"] ?? markColorClasses.yellow;

    return (
      <mark
        className={[
          "box-decoration-clone rounded-sm px-1 py-0.5",
          colorClass,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
  sub: ({ className, ...props }: ComponentPropsWithoutRef<"sub">) => (
    <sub
      className={["text-[0.75em] leading-none", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
  sup: ({ className, ...props }: ComponentPropsWithoutRef<"sup">) => (
    <sup
      className={["text-[0.75em] leading-none", className]
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
  kbd: ({ className, ...props }: ComponentPropsWithoutRef<"kbd">) => (
    <kbd
      className={[
        "inline-flex min-w-[1.75em] items-center justify-center whitespace-nowrap rounded-md",
        "border border-b-2 border-zinc-300 bg-zinc-50 px-1.5 py-0.5 align-middle",
        "font-mono text-[0.8em] font-medium leading-none text-zinc-700 shadow-sm",
        "dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  ),
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
