const PERIODS = [
  { value: "daily",   label: "Daily"   },
  { value: "weekly",  label: "Weekly"  },
  { value: "monthly", label: "Monthly" },
];

const PeriodSelector = ({ value, onChange }) => (
  <div style={styles.wrapper}>
    {PERIODS.map((p) => (
      <button
        key={p.value}
        onClick={() => onChange(p.value)}
        style={{
          ...styles.btn,
          ...(value === p.value ? styles.btnActive : {}),
        }}
      >
        {p.label}
      </button>
    ))}
  </div>
);

const styles = {
  wrapper: {
    display: "inline-flex",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "3px",
    gap: "2px",
  },
  btn: {
    padding: "7px 18px",
    borderRadius: "9px",
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "var(--transition)",
    fontFamily: "var(--font-body)",
  },
  btnActive: {
    background: "var(--accent)",
    color: "#fff",
    fontWeight: "600",
    boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
  },
};

export default PeriodSelector;