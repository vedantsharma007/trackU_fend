const StatsBar = ({ tasks }) => {
  const total     = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending   = tasks.filter((t) => t.status !== "completed").length;
  const high      = tasks.filter((t) => t.priority === "high").length;
  const overdue   = tasks.filter((t) => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date(new Date().toDateString());
  }).length;

  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total",     value: total,          color: "var(--text-secondary)", bg: "rgba(255,255,255,0.05)" },
    { label: "Pending",   value: pending,         color: "var(--accent)",         bg: "var(--accent-dim)"       },
    { label: "Done",      value: completed,       color: "var(--success)",        bg: "var(--success-dim)"      },
    { label: "High",      value: high,            color: "var(--error)",          bg: "var(--error-dim)"        },
    { label: "Overdue",   value: overdue,         color: "var(--warning)",        bg: "var(--warning-dim)"      },
  ];

  return (
    <div style={styles.wrapper} className="animate-fadeInUp">
      {/* Stat cards */}
      <div style={styles.grid}>
        {stats.map((s) => (
          <div key={s.label} style={{ ...styles.statCard, background: s.bg }}>
            <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar — only show when there are tasks */}
      {total > 0 && (
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Overall progress</span>
            <span style={styles.progressPct}>{completionPct}%</span>
          </div>
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${completionPct}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "10px",
  },
  statCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "3px",
    padding: "14px 8px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    textAlign: "center",
    transition: "var(--transition)",
  },
  statValue: {
    fontSize: "22px",
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    lineHeight: 1,
    letterSpacing: "-0.03em",
  },
  statLabel: {
    fontSize: "11px",
    fontWeight: "500",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  progressSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: "12px",
    color: "var(--text-muted)",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  progressPct: {
    fontSize: "13px",
    fontWeight: "700",
    color: "var(--accent)",
    fontFamily: "var(--font-display)",
  },
  progressTrack: {
    height: "5px",
    background: "var(--bg-card)",
    borderRadius: "99px",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, var(--accent), var(--accent-hover))",
    borderRadius: "99px",
    transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
    boxShadow: "0 0 8px var(--accent-glow)",
  },
};

export default StatsBar;