import { useEffect, useState, useMemo } from "react";
import { useTasks } from "../context/TaskContext";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsBar from "../components/dashboard/StatsBar";
import AddTaskForm from "../components/dashboard/AddTaskForm";
import SearchBar from "../components/dashboard/SearchBar";
import RecurringFilter from "../components/dashboard/RecurringFilter";
import TaskList from "../components/dashboard/TaskList";
import Alert from "../components/ui/Alert";

const PRIORITY_FILTERS = [
  { value: "all",    label: "All"       },
  { value: "high",   label: "🔴 High"   },
  { value: "medium", label: "🟡 Medium" },
  { value: "low",    label: "🟢 Low"    },
];

const STATUS_FILTERS = [
  { value: "all",          label: "Any status"  },
  { value: "pending",      label: "Pending"     },
  { value: "in-progress",  label: "In Progress" },
  { value: "completed",    label: "Completed"   },
];

const DashboardPage = () => {
  const { tasks, loading, error, loadTasks, clearError } = useTasks();

  const [searchQuery,     setSearchQuery]     = useState("");
  const [priorityFilter,  setPriorityFilter]  = useState("all");
  const [statusFilter,    setStatusFilter]    = useState("all");
  const [recurringFilter, setRecurringFilter] = useState("all");

  useEffect(() => { loadTasks(); }, [loadTasks]);

  // Counts per recurring type — for badge numbers in RecurringFilter
  const recurringCounts = useMemo(() => {
    const counts = { all: tasks.length, none: 0, daily: 0, weekly: 0, monthly: 0 };
    tasks.forEach((t) => {
      const r = t.recurring || "none";
      if (counts[r] !== undefined) counts[r]++;
    });
    return counts;
  }, [tasks]);

  // All active filters combined
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (priorityFilter  !== "all") result = result.filter((t) => t.priority === priorityFilter);
    if (statusFilter    !== "all") result = result.filter((t) => (t.status || "pending") === statusFilter);
    if (recurringFilter !== "all") result = result.filter((t) => (t.recurring || "none") === recurringFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tasks, searchQuery, priorityFilter, statusFilter, recurringFilter]);

  const hasActiveFilter =
    priorityFilter !== "all" ||
    statusFilter   !== "all" ||
    recurringFilter !== "all" ||
    searchQuery.trim();

  const clearAllFilters = () => {
    setSearchQuery("");
    setPriorityFilter("all");
    setStatusFilter("all");
    setRecurringFilter("all");
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow} />

      <DashboardHeader taskCount={tasks.length} />

      <main style={styles.main}>
        <div style={styles.container}>

          {/* Page heading */}
          <div style={styles.pageHead} className="animate-fadeInUp">
            <div>
              <h1 style={styles.pageTitle}>My Tasks</h1>
              <p style={styles.pageSubtitle}>
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </p>
            </div>
          </div>

          {/* Stats */}
          {tasks.length > 0 && <StatsBar tasks={tasks} />}

          {/* Error */}
          {error && <Alert message={error} type="error" onClose={clearError} />}

          {/* ── Add Task ── */}
          <SectionDivider label="Add Task" />
          <AddTaskForm onSuccess={loadTasks} />

          {/* ── Recurring filter ── */}
          <SectionDivider label="Recurring" />
          <RecurringFilter
            value={recurringFilter}
            onChange={setRecurringFilter}
            counts={recurringCounts}
          />

          {/* ── Search + Filters ── */}
          <SectionDivider label="Filter & Search" />

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={filteredTasks.length}
            totalCount={tasks.length}
          />

          {/* Priority filters */}
          <div style={styles.filterRow}>
            {PRIORITY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setPriorityFilter(f.value)}
                style={{
                  ...styles.pill,
                  ...(priorityFilter === f.value ? styles.pillActive : {}),
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Status filters */}
          <div style={styles.filterRow}>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                style={{
                  ...styles.pill,
                  ...(statusFilter === f.value ? styles.pillActive : {}),
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Results row */}
          {!loading && (
            <div style={styles.resultsRow}>
              <span style={styles.resultsText}>
                Showing{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {filteredTasks.length}
                </strong>
                {" "}of{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {tasks.length}
                </strong>
                {" "}task{tasks.length !== 1 ? "s" : ""}
              </span>
              {hasActiveFilter && (
                <button onClick={clearAllFilters} style={styles.clearBtn}>
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Task list */}
          <TaskList
            tasks={filteredTasks}
            loading={loading}
            searchQuery={searchQuery}
            activeFilter={priorityFilter}
          />

        </div>
      </main>
    </div>
  );
};

/* ─── Section Divider ────────────────────────────── */
const SectionDivider = ({ label }) => (
  <div style={dividerStyles.wrapper}>
    <span style={dividerStyles.label}>{label}</span>
    <div style={dividerStyles.line} />
  </div>
);

const dividerStyles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "4px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    whiteSpace: "nowrap",
  },
  line: {
    flex: 1,
    height: "1px",
    background: "var(--border)",
  },
};

/* ─── Page Styles ────────────────────────────────── */
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
    top: "-20%",
    right: "-20%",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.055) 0%, transparent 70%)",
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
    gap: "16px",
  },
  pageHead: { marginBottom: "4px" },
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
  filterRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  pill: {
    padding: "5px 13px",
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
  pillActive: {
    background: "var(--accent-dim)",
    borderColor: "rgba(99,102,241,0.35)",
    color: "var(--accent)",
    fontWeight: "600",
  },
  resultsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  resultsText: {
    fontSize: "13px",
    color: "var(--text-muted)",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "var(--accent)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "var(--font-body)",
    padding: "3px 0",
    textDecoration: "underline",
    textDecorationColor: "transparent",
    transition: "var(--transition)",
  },
};

export default DashboardPage;