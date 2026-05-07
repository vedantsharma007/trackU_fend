import { useState } from "react";
import { useTasks } from "../../context/TaskContext";
import RecurringBadge from "./RecurringBadge";

// ─── Config ───────────────────────────────────────
const PRIORITY_CONFIG = {
  high:   { color: "#f87171", bg: "rgba(248,113,113,0.1)",  label: "High"   },
  medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",   label: "Medium" },
  low:    { color: "#34d399", bg: "rgba(52,211,153,0.1)",   label: "Low"    },
};

const STATUS_CONFIG = {
  completed:     { color: "var(--success)",    bg: "var(--success-dim)",       label: "Completed"   },
  "in-progress": { color: "var(--accent)",     bg: "var(--accent-dim)",        label: "In Progress" },
  pending:       { color: "var(--text-muted)", bg: "rgba(128,128,128,0.07)",   label: "Pending"     },
};

// ─── Helpers ──────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status === "completed") return false;
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due < now;
};

const getNextRunLabel = (recurring) => {
  const next = new Date();
  if (recurring === "daily")   next.setDate(next.getDate() + 1);
  if (recurring === "weekly")  next.setDate(next.getDate() + 7);
  if (recurring === "monthly") next.setMonth(next.getMonth() + 1);
  return next.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const getResetLabel = (recurring) => {
  const now = new Date();
  if (recurring === "daily") {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return "tomorrow (" + d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + ")";
  }
  if (recurring === "weekly") {
    const d = new Date(now);
    d.setDate(d.getDate() + (7 - d.getDay()));
    d.setHours(0, 0, 0, 0);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  if (recurring === "monthly") {
    const d = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  return "";
};

// ─── Icons ────────────────────────────────────────
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8"  y1="2" x2="8"  y2="6" />
    <line x1="3"  y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SpinIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5"
    style={{ animation: "spin 0.7s linear infinite", display: "block" }}>
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
  </svg>
);

// ─── Component ────────────────────────────────────
const TaskCard = ({ task, index = 0 }) => {
  const { removeTask, editTask } = useTasks();

  const [deleting,      setDeleting]      = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toggling,      setToggling]      = useState(false);
  const [hovered,       setHovered]       = useState(false);

  const priorityKey  = PRIORITY_CONFIG[task.priority] ? task.priority : "medium";
  const priority     = PRIORITY_CONFIG[priorityKey];
  const statusKey    = STATUS_CONFIG[task.status] ? task.status : "pending";
  const status       = STATUS_CONFIG[statusKey];
  const isDone       = statusKey === "completed";
  const overdue      = isOverdue(task.dueDate, task.status);
  const isRecurring  = task.recurring && task.recurring !== "none";
  const staggerClass = "stagger-" + Math.min(index + 1, 10);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    await removeTask(task._id);
  };

  const handleToggleComplete = async () => {
    if (toggling) return;
    setToggling(true);
    await editTask(task._id, {
      status: isDone ? "pending" : "completed",
    });
    setToggling(false);
  };

  return (
    <div
      className={"animate-fadeInUp " + staggerClass}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={Object.assign(
        {},
        styles.card,
        hovered ? styles.cardHovered : {},
        isDone  ? styles.cardDone   : {}
      )}
    >
      {/* Priority stripe */}
      <div style={{ ...styles.stripe, background: priority.color }} />

      {/* Checkbox */}
      <button
        onClick={handleToggleComplete}
        disabled={toggling}
        title={isDone ? "Mark as pending" : "Mark as complete"}
        style={Object.assign(
          {},
          styles.checkbox,
          isDone   ? styles.checkboxDone  : {},
          toggling ? { opacity: 0.6 }     : {}
        )}
      >
        {toggling ? <SpinIcon size={11} /> : isDone ? <CheckIcon /> : null}
      </button>

      {/* Body */}
      <div style={styles.body}>

        {/* Title + delete */}
        <div style={styles.topRow}>
          <h3 style={Object.assign({}, styles.title, isDone ? styles.titleDone : {})}>
            {task.title}
          </h3>
          <div style={{
            ...styles.actions,
            opacity:       hovered || confirmDelete ? 1 : 0,
            pointerEvents: hovered || confirmDelete ? "auto" : "none",
          }}>
            <button
              onClick={handleDelete}
              disabled={deleting}
              title={confirmDelete ? "Click again to confirm" : "Delete"}
              style={Object.assign(
                {},
                styles.actionBtn,
                confirmDelete ? styles.actionBtnDanger : {}
              )}
            >
              {deleting
                ? <SpinIcon size={13} />
                : confirmDelete
                ? "Confirm?"
                : <TrashIcon />}
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p style={Object.assign({}, styles.description, isDone ? styles.descriptionDone : {})}>
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div style={styles.footer}>

          {/* Priority */}
          <span style={{ ...styles.badge, background: priority.bg, color: priority.color }}>
            <span style={{ ...styles.dot, background: priority.color }} />
            {priority.label}
          </span>

          {/* Status */}
          <span style={{ ...styles.badge, background: status.bg, color: status.color }}>
            {isDone && isRecurring ? "Done this period" : status.label}
          </span>

          {/* Recurring badge */}
          <RecurringBadge recurring={task.recurring} />

          {/* Due date */}
          {task.dueDate && (
            <span style={{
              ...styles.dueDateTag,
              color:       overdue ? "var(--error)"              : "var(--text-muted)",
              background:  overdue ? "var(--error-dim)"          : "transparent",
              borderColor: overdue ? "rgba(248,113,113,0.2)"     : "transparent",
            }}>
              <CalendarIcon />
              {formatDate(task.dueDate)}
              {overdue && <span style={styles.overdueTag}>Overdue</span>}
            </span>
          )}

          {/* Recurring — shows reset date when done, next run when pending */}
          {isRecurring && (
            <span style={{
              ...styles.nextRunHint,
              color: isDone ? "var(--success)" : "var(--text-muted)",
            }}>
              {isDone
                ? <><CheckIcon />&nbsp;{"Resets " + getResetLabel(task.recurring)}</>
                : <><ClockIcon />&nbsp;{"Next: " + getNextRunLabel(task.recurring)}</>
              }
            </span>
          )}

        </div>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────
const styles = {
  card: {
    display: "flex",
    alignItems: "stretch",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    transition: "var(--transition)",
  },
  cardHovered: {
    background: "var(--bg-card-hover)",
    borderColor: "rgba(128,128,128,0.2)",
    transform: "translateY(-1px)",
    boxShadow: "var(--shadow-sm)",
  },
  cardDone: {
    opacity: 0.6,
  },
  stripe: {
    width: "3px",
    flexShrink: 0,
  },
  checkbox: {
    flexShrink: 0,
    alignSelf: "flex-start",
    margin: "15px 0 0 13px",
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    border: "2px solid var(--border)",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "var(--transition)",
    color: "#fff",
  },
  checkboxDone: {
    background: "var(--success)",
    borderColor: "var(--success)",
  },
  body: {
    flex: 1,
    padding: "13px 13px 13px 11px",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    minWidth: 0,
  },
  topRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "10px",
  },
  title: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text-primary)",
    fontFamily: "var(--font-display)",
    letterSpacing: "-0.01em",
    lineHeight: 1.45,
    flex: 1,
    minWidth: 0,
    wordBreak: "break-word",
    transition: "var(--transition)",
  },
  titleDone: {
    textDecoration: "line-through",
    color: "var(--text-muted)",
  },
  description: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: 1.55,
    wordBreak: "break-word",
  },
  descriptionDone: {
    color: "var(--text-muted)",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
    marginTop: "2px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: "600",
    padding: "3px 9px",
    borderRadius: "20px",
    textTransform: "capitalize",
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  },
  dot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  dueDateTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    fontWeight: "500",
    padding: "3px 7px",
    borderRadius: "6px",
    borderWidth: "1px",    // ← always present
    borderStyle: "solid",  // ← always present
    borderColor: "transparent", // ← default transparent, overridden when overdue
  },
  overdueTag: {
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginLeft: "1px",
  },
  nextRunHint: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "11px",
    marginLeft: "auto",
    whiteSpace: "nowrap",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flexShrink: 0,
    transition: "opacity 0.18s ease",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px",
    background: "none",
    border: "none",
    borderRadius: "6px",
    color: "var(--text-muted)",
    cursor: "pointer",
    transition: "var(--transition)",
    fontSize: "11px",
    fontWeight: "600",
    fontFamily: "var(--font-body)",
    whiteSpace: "nowrap",
  },
  actionBtnDanger: {
    color: "var(--error)",
    background: "var(--error-dim)",
    padding: "4px 9px",
  },
};

export default TaskCard;
