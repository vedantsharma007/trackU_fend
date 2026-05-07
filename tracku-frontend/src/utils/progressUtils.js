// ─── Date helpers ─────────────────────────────────────────────────────────────

export const today = () => new Date(new Date().toDateString());

export const startOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const startOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const isSameDay = (a, b) => {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth()    === db.getMonth()    &&
    da.getDate()     === db.getDate()
  );
};

export const formatShortDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export const formatMonthYear = (date) =>
  new Date(date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

// ─── Period buckets ───────────────────────────────────────────────────────────

/**
 * Returns last N days as { date, label } array (oldest → newest)
 */
export const getLastNDays = (n = 7) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push({
      date: d,
      label: i === 0
        ? "Today"
        : i === 1
        ? "Yesterday"
        : d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
    });
  }
  return days;
};

/**
 * Returns last N weeks as { startDate, endDate, label } array
 */
export const getLastNWeeks = (n = 6) => {
  const weeks = [];
  for (let i = n - 1; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - start.getDay() - i * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    weeks.push({
      startDate: start,
      endDate: end,
      label: i === 0 ? "This week" : `${formatShortDate(start)}`,
    });
  }
  return weeks;
};

/**
 * Returns last N months as { startDate, endDate, label } array
 */
export const getLastNMonths = (n = 6) => {
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end   = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    months.push({
      startDate: start,
      endDate: end,
      label: i === 0
        ? "This month"
        : start.toLocaleDateString("en-IN", { month: "short" }),
    });
  }
  return months;
};

// ─── Task analytics ───────────────────────────────────────────────────────────

/**
 * Given tasks + a date range, returns { total, completed, rate }
 */
export const getStatsForRange = (tasks, startDate, endDate) => {
  const inRange = tasks.filter((t) => {
    const ref = t.updatedAt || t.createdAt;
    if (!ref) return false;
    const d = new Date(ref);
    return d >= startDate && d <= endDate;
  });
  const completed = inRange.filter((t) => t.status === "completed").length;
  return {
    total:     inRange.length,
    completed,
    rate:      inRange.length > 0 ? Math.round((completed / inRange.length) * 100) : 0,
  };
};

/**
 * Builds daily bar-chart data for the last N days
 */
export const buildDailyChartData = (tasks, days = 7) => {
  const buckets = getLastNDays(days);
  return buckets.map(({ date, label }) => {
    const dayStart = new Date(date);
    const dayEnd   = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const stats = getStatsForRange(tasks, dayStart, dayEnd);
    return { label, ...stats, date };
  });
};

/**
 * Builds weekly bar-chart data for the last N weeks
 */
export const buildWeeklyChartData = (tasks, weeks = 6) => {
  return getLastNWeeks(weeks).map(({ startDate, endDate, label }) => {
    const stats = getStatsForRange(tasks, startDate, endDate);
    return { label, ...stats, date: startDate };
  });
};

/**
 * Builds monthly bar-chart data for the last N months
 */
export const buildMonthlyChartData = (tasks, months = 6) => {
  return getLastNMonths(months).map(({ startDate, endDate, label }) => {
    const stats = getStatsForRange(tasks, startDate, endDate);
    return { label, ...stats, date: startDate };
  });
};

/**
 * Calculates current completion streak (consecutive days with ≥1 completed task)
 */
export const calcStreak = (tasks) => {
  const completedTasks = tasks.filter((t) => t.status === "completed");
  if (completedTasks.length === 0) return 0;

  const completedDays = new Set(
    completedTasks.map((t) => {
      const d = new Date(t.updatedAt || t.createdAt);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    })
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // Check today first — if no completion today, streak might still count from yesterday
  if (!completedDays.has(cursor.getTime())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (completedDays.has(cursor.getTime())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

/**
 * Returns overall stats across all tasks
 */
export const calcOverallStats = (tasks) => {
  const total       = tasks.length;
  const completed   = tasks.filter((t) => t.status === "completed").length;
  const pending     = tasks.filter((t) => t.status !== "completed").length;
  const overdue     = tasks.filter((t) => {
    if (!t.dueDate || t.status === "completed") return false;
    return new Date(t.dueDate) < today();
  }).length;
  const recurring   = tasks.filter((t) => t.recurring && t.recurring !== "none").length;
  const rate        = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pending, overdue, recurring, rate };
};