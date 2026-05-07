const StatCard = ({ label, value, sub, color = "var(--text-primary)", icon, highlight }) => (
  <div
    style={{
      ...styles.card,
      ...(highlight ? styles.cardHighlight : {}),
    }}
    className="animate-fadeInUp"
  >
    {icon && <div style={{ ...styles.iconWrap, color }}>{icon}</div>}
    <div style={styles.body}>
      <span style={{ ...styles.value, color }}>{value}</span>
      <span style={styles.label}>{label}</span>
      {sub && <span style={styles.sub}>{sub}</span>}
    </div>
  </div>
);

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "18px 16px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    transition: "var(--transition)",
    minWidth: 0,
  },
  cardHighlight: {
    background: "var(--accent-dim)",
    borderColor: "rgba(99,102,241,0.25)",
  },
  iconWrap: {
    fontSize: "20px",
    lineHeight: 1,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  value: {
    fontSize: "26px",
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    letterSpacing: "-0.04em",
    lineHeight: 1,
  },
  label: {
    fontSize: "12px",
    color: "var(--text-muted)",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginTop: "2px",
  },
  sub: {
    fontSize: "11px",
    color: "var(--text-muted)",
    marginTop: "1px",
  },
};

export default StatCard;