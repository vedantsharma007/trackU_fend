const OPTIONS = [
  { value: "all",     label: "All tasks",  icon: "◎" },
  { value: "none",    label: "One-time",   icon: "○" },
  { value: "daily",   label: "Daily",      icon: "↻", color: "#a78bfa" },
  { value: "weekly",  label: "Weekly",     icon: "↻", color: "#60a5fa" },
  { value: "monthly", label: "Monthly",    icon: "↻", color: "#f472b6" },
];

const RecurringFilter = ({ value, onChange, counts }) => {
  return (
    <div style={styles.wrapper}>
      {OPTIONS.map((opt) => {
        const isActive = value === opt.value;
        const count = counts?.[opt.value];

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              ...styles.btn,
              ...(isActive ? {
                ...styles.btnActive,
                ...(opt.color ? {
                  background: `${opt.color}18`,
                  borderColor: `${opt.color}44`,
                  color: opt.color,
                } : {}),
              } : {}),
            }}
          >
            <span style={{
              ...styles.icon,
              ...(opt.color && isActive ? { color: opt.color } : {}),
            }}>
              {opt.icon}
            </span>
            {opt.label}
            {count !== undefined && count > 0 && (
              <span style={{
                ...styles.count,
                background: isActive && opt.color ? `${opt.color}25` : "var(--bg-card)",
                color: isActive && opt.color ? opt.color : "var(--text-muted)",
              }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  btn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 13px",
    borderRadius: "20px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    color: "var(--text-secondary)",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "var(--transition)",
    fontFamily: "var(--font-body)",
    whiteSpace: "nowrap",
  },
  btnActive: {
    background: "var(--accent-dim)",
    borderColor: "rgba(99,102,241,0.35)",
    color: "var(--accent)",
    fontWeight: "600",
  },
  icon: {
    fontSize: "13px",
    lineHeight: 1,
    color: "var(--text-muted)",
  },
  count: {
    fontSize: "10px",
    fontWeight: "700",
    padding: "1px 6px",
    borderRadius: "10px",
    lineHeight: 1.6,
    letterSpacing: "0.02em",
  },
};

export default RecurringFilter;