const StatCard = ({
  value,
  label,
  tone,
}: {
  value: string | number;
  label: string;
  tone: "accent" | "danger" | "neutral";
}) => {
  const styles = {
    accent: {
      wrap: "bg-accent-soft/60 border-line",
      value: "text-accent",
    },
    danger: {
      wrap: "bg-[#f7efee] border-[#e8d4d2]",
      value: "text-[#8f4a47]",
    },
    neutral: {
      wrap: "bg-surface border-line",
      value: "text-ink",
    },
  }[tone];

  return (
    <div
      className={`rounded-xl border px-5 py-5 shadow-lift transition-transform duration-200 hover:-translate-y-0.5 ${styles.wrap}`}
    >
      <p
        className={`text-[2rem] sm:text-4xl font-semibold tabular-nums tracking-tight leading-none ${styles.value}`}
      >
        {value}
      </p>
      <p className="text-sm text-mist mt-2.5 font-medium leading-snug text-pretty max-w-[14rem]">
        {label}
      </p>
    </div>
  );
};

export default StatCard;
