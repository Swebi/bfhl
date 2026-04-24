const TagSection = ({
  title,
  count,
  tags,
  variant,
  emptyText,
  renderTag,
}: {
  title: string;
  count: number;
  tags: string[];
  variant: "invalid" | "duplicate";
  emptyText: string;
  renderTag?: (s: string) => string;
}) => {
  const badge =
    variant === "invalid"
      ? "bg-[#faf6ed] text-[#6b5c32] border-[#e8dfc8]"
      : "bg-accent-soft text-accent border-accent/20";

  const tag =
    variant === "invalid"
      ? "bg-[#fdfaf3] border-[#e8dfc8] text-[#5c4f28]"
      : "bg-surface border-line text-mist";

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-lift">
      <h2 className="text-sm font-semibold text-ink mb-3 flex flex-wrap items-center gap-2">
        {title}
        <span
          className={`tabular-nums px-2 py-0.5 rounded-md text-xs font-semibold border ${badge}`}
        >
          {count}
        </span>
      </h2>
      {tags.length === 0 ? (
        <p className="text-sm text-mist leading-relaxed max-w-content">
          {emptyText}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((e, i) => (
            <span
              key={i}
              className={`px-2 py-1 border rounded-md font-mono text-xs tabular-nums ${tag}`}
            >
              {renderTag ? renderTag(e) : e}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSection;
