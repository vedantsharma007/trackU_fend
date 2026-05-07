import { useEffect, useState, useMemo } from "react";
import { useTasks } from "../context/TaskContext";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import PeriodSelector from "../components/progress/PeriodSelector";
import StatCard from "../components/progress/StatCard";
import MiniBarChart from "../components/progress/MiniBarChart";
import ProgressRing from "../components/progress/ProgressRing";
import Alert from "../components/ui/Alert";
import {
  calcOverallStats,
  calcStreak,
  buildDailyChartData,
  buildWeeklyChartData,
  buildMonthlyChartData,
  getStatsForRange,
  startOfWeek,
  startOfMonth,
  today,
} from "../utils/progressUtils";

const ProgressPage = () => {
  const { tasks, loading, error, loadTasks, clearError } = useTasks();
  const [period, setPeriod] = useState("daily");

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // ── Derived stats ──────────────────────────────────
  const overall  = useMemo(() => calcOverallStats(tasks), [tasks]);
  const streak   = useMemo(() => calcStreak(tasks), [tasks]);

  // Current period stats (today / this week / this month)
  const periodStats = useMemo(() => {
    const now = new Date();
    if (period === "daily") {
      const s = today();
      const e = new Date(s); e.setHours(23, 59, 59, 999);
      return getStatsForRange(tasks, s, e);
    }
    if (period === "weekly") {
      const s = startOfWeek(now);
      const e = new Date(s); e.setDate(s.getDate() + 6); e.setHours(23, 59, 59, 999);
      return getStatsForRange(tasks, s, e);
    }
    // monthly
    const s = startOfMonth(now);
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return getStatsForRange(tasks, s, e);
  }, [tasks, period]);

  // Chart data
  const chartData = useMemo(() => {
    if (period === "daily")   return buildDailyChartData(tasks, 7);
    if (period === "weekly")  return buildWeeklyChartData(tasks, 6);
    return buildMonthlyChartData(tasks, 6);
  }, [tasks, period]);

  const periodLabel = period === "daily" ? "Today" : period === "weekly" ? "This week" : "This month";

  // Top 3 most active days (by tasks updated)
  const topDays = useMemo(() => {
    const dailyData = buildDailyChartData(tasks, 14);
    return [...dailyData]
      .filter((d) => d.completed > 0)
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 3);
  }, [tasks]);

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow} />

      <DashboardHeader taskCount={tasks.length} />

      <main style={styles.main}>
        <div style={styles.container}>

          {/* ── Header ───────────────────────────── */}
          <div style={styles.pageHead} className="animate-fadeInUp">
            <div>
              <h1 style={styles.pageTitle}>Progress</h1>
              <p style={styles.pageSubtitle}>Track how you're doing over time</p>
            </div>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>

          {error && <Alert message={error} type="error" onClose={clearError} />}

          {loading ? (
            <div style={styles.loadingState}>
              <SpinnerIcon />
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading…</p>
            </div>
          ) : (
            <>
              {/* ── Current Period Hero ───────────── */}
              <div style={styles.heroCard} className="animate-scaleIn">
                <div style={styles.heroLeft}>
                  <ProgressRing
                    pct={periodStats.rate}
                    size={130}
                    stroke={9}
                    label={periodLabel}
                    sublabel={`${periodStats.completed} of ${periodStats.total} tasks`}
                  />
                </div>
                <div style={styles.heroRight}>
                  <p style={styles.heroTitle}>{periodLabel}</p>
                  <div style={styles.heroStats}>
                    <div style={styles.heroStat}>
                      <span style={{ ...styles.heroStatVal, color: "var(--success)" }}>
                        {periodStats.completed}
                      </span>
                      <span style={styles.heroStatLabel}>Completed</span>
                    </div>
                    <div style={styles.heroDivider} />
                    <div style={styles.heroStat}>
                      <span style={{ ...styles.heroStatVal, color: "var(--accent)" }}>
                        {periodStats.total - periodStats.completed}
                      </span>
                      <span style={styles.heroStatLabel}>Remaining</span>
                    </div>
                    <div style={styles.heroDivider} />
                    <div style={styles.heroStat}>
                      <span style={{ ...styles.heroStatVal, color: "var(--warning)" }}>
                        {periodStats.total}
                      </span>
                      <span style={styles.heroStatLabel}>Total active</span>
                    </div>
                  </div>

                  {/* Streak */}
                  <div style={styles.streakBadge}>
                    <span style={styles.streakFire}>🔥</span>
                    <div>
                      <p style={styles.streakVal}>{streak} day{streak !== 1 ? "s" : ""}</p>
                      <p style={styles.streakLabel}>Current streak</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Overall stats grid ────────────── */}
              <SectionDivider label="All-time stats" />
              <div style={styles.statsGrid}>
                <StatCard
                  label="Total tasks"
                  value={overall.total}
                  color="var(--text-primary)"
                  icon="📋"
                />
                <StatCard
                  label="Completed"
                  value={overall.completed}
                  color="var(--success)"
                  icon="✅"
                  sub={`${overall.rate}% completion rate`}
                  highlight={overall.rate >= 70}
                />
                <StatCard
                  label="Pending"
                  value={overall.pending}
                  color="var(--accent)"
                  icon="⏳"
                />
                <StatCard
                  label="Overdue"
                  value={overall.overdue}
                  color={overall.overdue > 0 ? "var(--error)" : "var(--text-muted)"}
                  icon="⚠️"
                />
                <StatCard
                  label="Recurring"
                  value={overall.recurring}
                  color="#a78bfa"
                  icon="↻"
                  sub="Auto-repeat tasks"
                />
                <StatCard
                  label="Best streak"
                  value={`${streak}d`}
                  color="var(--warning)"
                  icon="🔥"
                  sub="Consecutive days"
                />
              </div>

              {/* ── Chart ─────────────────────────── */}
              <SectionDivider label={`${period.charAt(0).toUpperCase() + period.slice(1)} breakdown`} />
              <div style={styles.chartCard}>
                <div style={styles.chartHeader}>
                  <p style={styles.chartTitle}>
                    {period === "daily"
                      ? "Last 7 days"
                      : period === "weekly"
                      ? "Last 6 weeks"
                      : "Last 6 months"}
                  </p>
                  <p style={styles.chartSubtitle}>
                    Completed vs total tasks
                  </p>
                </div>
                {chartData.every((d) => d.total === 0) ? (
                  <div style={styles.chartEmpty}>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      No task activity in this period yet
                    </p>
                  </div>
                ) : (
                  <MiniBarChart data={chartData} height={170} />
                )}
              </div>

              {/* ── Top active days ───────────────── */}
              {topDays.length > 0 && (
                <>
                  <SectionDivider label="Most productive days (last 14 days)" />
                  <div style={styles.topDaysList}>
                    {topDays.map((d, i) => (
                      <div key={i} style={styles.topDayRow}>
                        <span style={styles.topDayRank}>#{i + 1}</span>
                        <span style={styles.topDayLabel}>{d.label}</span>
                        <div style={styles.topDayBar}>
                          <div
                            style={{
                              ...styles.topDayFill,
                              width: `${(d.completed / Math.max(...topDays.map((x) => x.completed))) * 100}%`,
                            }}
                          />
                        </div>
                        <span style={styles.topDayCount}>
                          {d.completed} done
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Priority breakdown ────────────── */}
              <SectionDivider label="Priority breakdown" />
              <div style={styles.priorityGrid}>
                {[
                  { key: "high",   label: "High",   color: "#f87171", bg: "rgba(248,113,113,0.1)" },
                  { key: "medium", label: "Medium",  color: "#fbbf24", bg: "rgba(251,191,36,0.1)"  },
                  { key: "low",    label: "Low",     color: "#34d399", bg: "rgba(52,211,153,0.1)"  },
                ].map(({ key, label, color, bg }) => {
                  const bucket     = tasks.filter((t) => t.priority === key);
                  const bucketDone = bucket.filter((t) => t.status === "completed").length;
                  const bucketPct  = bucket.length > 0 ? Math.round((bucketDone / bucket.length) * 100) : 0;
                  return (
                    <div key={key} style={{ ...styles.priorityCard, background: bg, border: `1px solid ${color}22` }}>
                      <div style={styles.priorityTop}>
                        <span style={{ ...styles.priorityLabel, color }}>{label}</span>
                        <span style={{ ...styles.priorityPct, color }}>{bucketPct}%</span>
                      </div>
                      <p style={styles.priorityCount}>
                        {bucketDone} / {bucket.length} completed
                      </p>
                      <div style={styles.priorityTrack}>
                        <div
                          style={{
                            ...styles.priorityFill,
                            width: `${bucketPct}%`,
                            background: color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

/* ─── Section Divider ────────────────────────────── */
const SectionDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px" }}>
    <span style={{
      fontSize: "11px", fontWeight: "600", color: "var(--text-muted)",
      textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap",
    }}>
      {label}
    </span>
    <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
  </div>
);

/* ─── Spinner ────────────────────────────────────── */
const SpinnerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ animation: "spin 0.7s linear infinite" }}>
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
  </svg>
);

/* ─── Styles ─────────────────────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "var(--bg-primary)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  bgGlow: {
    position: "fixed",
    bottom: "-20%",
    left: "-15%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  main: {
    flex: 1,
    padding: "32px 20px 80px",
    position: "relative",
    zIndex: 1,
  },
  container: {
    maxWidth: "740px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "80px 0",
  },
  pageHead: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  pageTitle: {
    fontSize: "30px",
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    color: "var(--text-primary)",
    letterSpacing: "-0.04em",
    lineHeight: 1.15,
  },
  pageSubtitle: {
    fontSize: "13px",
    color: "var(--text-muted)",
    marginTop: "4px",
  },
  heroCard: {
    display: "flex",
    gap: "28px",
    background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.06) 100%)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "var(--radius-lg)",
    padding: "28px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  heroLeft: {
    flexShrink: 0,
  },
  heroRight: {
    flex: 1,
    minWidth: "200px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  heroTitle: {
    fontSize: "18px",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  heroStats: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  heroStat: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  heroStatVal: {
    fontSize: "22px",
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    letterSpacing: "-0.03em",
    lineHeight: 1,
  },
  heroStatLabel: {
    fontSize: "11px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: "500",
  },
  heroDivider: {
    width: "1px",
    height: "28px",
    background: "var(--border)",
    flexShrink: 0,
  },
  streakBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    background: "rgba(251,191,36,0.1)",
    border: "1px solid rgba(251,191,36,0.2)",
    borderRadius: "var(--radius)",
    width: "fit-content",
  },
  streakFire: {
    fontSize: "22px",
    lineHeight: 1,
  },
  streakVal: {
    fontSize: "16px",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    color: "var(--warning)",
    lineHeight: 1.2,
  },
  streakLabel: {
    fontSize: "11px",
    color: "var(--text-muted)",
    marginTop: "1px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
  chartCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px",
  },
  chartHeader: {
    marginBottom: "18px",
  },
  chartTitle: {
    fontSize: "14px",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    color: "var(--text-primary)",
    letterSpacing: "-0.01em",
  },
  chartSubtitle: {
    fontSize: "12px",
    color: "var(--text-muted)",
    marginTop: "2px",
  },
  chartEmpty: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0",
  },
  topDaysList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "18px",
  },
  topDayRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  topDayRank: {
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--accent)",
    fontFamily: "var(--font-display)",
    width: "24px",
    flexShrink: 0,
  },
  topDayLabel: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    width: "90px",
    flexShrink: 0,
  },
  topDayBar: {
    flex: 1,
    height: "6px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "99px",
    overflow: "hidden",
  },
  topDayFill: {
    height: "100%",
    background: "linear-gradient(90deg, var(--accent), var(--accent-hover))",
    borderRadius: "99px",
    transition: "width 0.6s ease",
  },
  topDayCount: {
    fontSize: "12px",
    color: "var(--success)",
    fontWeight: "600",
    flexShrink: 0,
    width: "52px",
    textAlign: "right",
  },
  priorityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
  },
  priorityCard: {
    padding: "16px",
    borderRadius: "var(--radius)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  priorityTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityLabel: {
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "capitalize",
    fontFamily: "var(--font-display)",
    letterSpacing: "0.02em",
  },
  priorityPct: {
    fontSize: "18px",
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    letterSpacing: "-0.03em",
  },
  priorityCount: {
    fontSize: "11px",
    color: "var(--text-muted)",
  },
  priorityTrack: {
    height: "4px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "99px",
    overflow: "hidden",
  },
  priorityFill: {
    height: "100%",
    borderRadius: "99px",
    transition: "width 0.6s ease",
  },
};

export default ProgressPage;