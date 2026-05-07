const RECURRING_CONFIG = {
  daily:   { label: "Daily",   color: "#a78bfa", bg: "rgba(167,139,250,0.12)", symbol: "↻" },
  weekly:  { label: "Weekly",  color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  symbol: "↻" },
  monthly: { label: "Monthly", color: "#f472b6", bg: "rgba(244,114,182,0.12)", symbol: "↻" },
};

const RecurringBadge = ({ recurring }) => {
  if (!recurring || recurring === "none") return null;

  const config = RECURRING_CONFIG[recurring];
  if (!config) return null;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "11px",
        fontWeight: "600",
        padding: "3px 9px",
        borderRadius: "20px",
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.color}22`,
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
      title={`Repeats ${recurring}`}
    >
      <span style={{ fontSize: "12px", lineHeight: 1 }}>{config.symbol}</span>
      {config.label}
    </span>
  );
};

export default RecurringBadge;