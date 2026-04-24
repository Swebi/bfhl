const Badge = ({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "accent" | "danger" | "ok";
}) => {
  const cls = {
    accent: "bg-accent-soft text-accent border-accent/15",
    danger: "bg-[#f7efee] text-[#8f4a47] border-[#e8d4d2]/80",
    ok: "bg-[#e8efea] text-[#3d5a45] border-[#c5d4c8]",
  }[tone];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${cls}`}
    >
      {children}
    </span>
  );
};

export default Badge;
