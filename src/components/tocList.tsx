interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

interface TocListProps {
  entries: TocEntry[];
  depth?: number;
}

export function TocList({ entries, depth = 0 }: TocListProps) {
  if (entries.length === 0) return null;

  return (
    <ul
      className={
        depth === 0
          ? "space-y-2 text-sm"
          : "mt-2 space-y-2.5 border-l-[0.75px] border-zinc-300 pl-3"
      }
    >
      {entries.map((item) => (
        <li key={item.url}>
          <a href={item.url} className="hover:text-amber-500">
            {item.title}
          </a>
          <TocList entries={item.items} depth={depth + 1} />
        </li>
      ))}
    </ul>
  );
}
