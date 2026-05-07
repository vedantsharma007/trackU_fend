import TaskCard from "./TaskCard";

/* Skeleton loader for a single task card */
const TaskSkeleton = () => (
  <div style={skeletonStyles.card}>
    <div style={skeletonStyles.stripe} />
    <div style={skeletonStyles.body}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="skeleton" style={{ height: "14px", width: "55%", borderRadius: "6px" }} />
        <div className="skeleton" style={{ height: "14px", width: "12%", borderRadius: "6px" }} />
      </div>
      <div className="skeleton" style={{ height: "12px", width: "80%", borderRadius: "6px" }} />
      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
        <div className="skeleton" style={{ height: "20px", width: "56px", borderRadius: "20px" }} />
        <div className="skeleton" style={{ height: "20px", width: "70px", borderRadius: "20px" }} />
      </div>
    </div>
  </div>
);

const skeletonStyles = {
  card: {
    display: "flex",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    height: "88px",
  },
  stripe: {
    width: "3px",
    background: "var(--border)",
  },
  body: {
    flex: 1,
    padding: "14px 14px 14px 12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    justifyContent: "center",
  },
};

const EmptyState = ({ searchQuery, activeFilter }) => (
  <div style={emptyStyles.wrapper} className="animate-fadeIn">
    <div style={emptyStyles.iconRing}>
      <span style={emptyStyles.icon}>
        {searchQuery ? "🔍" : activeFilter !== "all" ? "🎯" : "✅"}
      </span>
    </div>
    <p style={emptyStyles.title}>
      {searchQuery
        ? `No results for "${searchQuery}"`
        : activeFilter !== "all"
        ? `No ${activeFilter} priority tasks`
        : "Your task list is empty"}
    </p>
    <p style={emptyStyles.subtitle}>
      {searchQuery
        ? "Try a different keyword"
        : activeFilter !== "all"
        ? "Try a different filter"
        : "Add your first task above to get started"}
    </p>
  </div>
);

const emptyStyles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "56px 20px",
    gap: "10px",
    textAlign: "center",
  },
  iconRing: {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "6px",
  },
  icon: {
    fontSize: "28px",
  },
  title: {
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "var(--font-display)",
    color: "var(--text-secondary)",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: "13px",
    color: "var(--text-muted)",
  },
};

const TaskList = ({ tasks, loading, searchQuery, activeFilter }) => {
  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[...Array(4)].map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState searchQuery={searchQuery} activeFilter={activeFilter} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {tasks.map((task, index) => (
        <TaskCard key={task._id} task={task} index={index} />
      ))}
    </div>
  );
};

export default TaskList;