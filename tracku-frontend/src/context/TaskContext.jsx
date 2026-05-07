import { createContext, useState, useCallback, useContext, useMemo } from "react";
import {
  fetchTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/taskService";

const TaskContext = createContext(null);

// ─── Helpers ──────────────────────────────────────

const parseError = (err) => {
  if (err.response?.data?.errors) {
    return err.response.data.errors.map((e) => e.msg).join(", ");
  }
  return err.response?.data?.message || "Something went wrong";
};

const normaliseTasks = (data) =>
  Array.isArray(data) ? data : data.tasks ?? data.data ?? [];

/**
 * Converts backend task to frontend-friendly shape.
 *
 * Backend quirks we handle:
 * 1. Uses `completed: boolean` instead of `status: string`
 * 2. Never returns `priority` field in responses
 * 3. Never returns `status` field — only `completed`
 *
 * Strategy: always merge server response ON TOP of existingTask,
 * so fields the server omits are preserved from local state.
 */
const normaliseTask = (serverData, existingTask = {}) => {
  // Unwrap nested: { task: {} } or { data: {} } or raw
  const raw = serverData?.task ?? serverData?.data ?? serverData ?? {};

  // Convert backend `completed: boolean` → frontend `status: string`
  let derivedStatus = undefined;
  if (typeof raw.completed === "boolean") {
    derivedStatus = raw.completed ? "completed" : "pending";
  }

  return {
    // 1. Start with existing task — preserves all local fields
    ...existingTask,
    // 2. Apply server fields
    ...raw,
    // 3. Explicit field guards — never overwrite with undefined/null
    priority: raw.priority  || existingTask.priority  || "medium",
    recurring: raw.recurring || existingTask.recurring || "none",
    // 4. Status: prefer explicit status field, fallback to derived from `completed`
    status: raw.status || derivedStatus || existingTask.status || "pending",
    // 5. dueDate: keep existing if server omitted it
    dueDate: raw.dueDate !== undefined ? raw.dueDate : existingTask.dueDate,
  };
};

/**
 * Recurring reset logic — checks if a completed recurring task
 * should reset based on its period boundary.
 */
const shouldResetRecurring = (task) => {
  if (!task.recurring || task.recurring === "none") return false;
  if (task.status !== "completed") return false;

  const completedAt = task.completedAt
    ? new Date(task.completedAt)
    : task.updatedAt
    ? new Date(task.updatedAt)
    : null;

  if (!completedAt) return false;

  const now = new Date();

  if (task.recurring === "daily") {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    return completedAt < todayStart;
  }
  if (task.recurring === "weekly") {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return completedAt < weekStart;
  }
  if (task.recurring === "monthly") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return completedAt < monthStart;
  }
  return false;
};

const applyRecurringResets = (tasks) =>
  tasks.map((t) =>
    shouldResetRecurring(t)
      ? { ...t, status: "pending", completed: false, _needsReset: true }
      : t
  );

// ─── Provider ─────────────────────────────────────

export const TaskProvider = ({ children }) => {
  const [tasks,         setTasks]         = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error,         setError]         = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      const raw  = normaliseTasks(data);

      // Normalise each task from backend format
      const normalised = raw.map((t) => normaliseTask(t));

      // Apply recurring resets
      const processed = applyRecurringResets(normalised);
      setTasks(processed);

      // Silently sync reset tasks back to backend
      processed
        .filter((t) => t._needsReset)
        .forEach(async (t) => {
          try {
            await updateTask(t._id, { status: "pending", completed: false });
          } catch (_) {}
        });
    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (taskData) => {
    setActionLoading(true);
    setError(null);
    try {
      const data = await createTask(taskData);

      // Seed normaliseTask with the original payload so priority is
      // NEVER lost even if backend doesn't return it
      const newTask = normaliseTask(data, {
        priority:    taskData.priority    || "medium",
        recurring:   taskData.recurring   || "none",
        dueDate:     taskData.dueDate     || null,
        title:       taskData.title,
        description: taskData.description || "",
        status:      "pending",
      });

      setTasks((prev) => [newTask, ...prev]);
      return { success: true };
    } catch (err) {
      const message = parseError(err);
      setError(message);
      return { success: false, message };
    } finally {
      setActionLoading(false);
    }
  }, []);

  const removeTask = useCallback(async (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
    try {
      await deleteTask(id);
      return { success: true };
    } catch (err) {
      const message = parseError(err);
      setError(message);
      loadTasks();
      return { success: false, message };
    }
  }, [loadTasks]);

  const editTask = useCallback(async (id, updateData) => {
    const now = new Date().toISOString();

    // Build optimistic patch
    const optimisticPatch = {
      ...updateData,
      updatedAt: now,
    };

    // If marking complete — set completedAt for recurring reset logic
    if (updateData.status === "completed") {
      optimisticPatch.completedAt = now;
      optimisticPatch.completed   = true;  // keep in sync with backend bool
    }
    if (updateData.status === "pending") {
      optimisticPatch.completedAt = null;
      optimisticPatch.completed   = false;
    }

    // Apply optimistic update immediately
    setTasks((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, ...optimisticPatch } : t
      )
    );

    try {
      // Send to backend — include both formats for compatibility
      const payload = {
        ...updateData,
        ...(updateData.status === "completed"
          ? { completed: true,  completedAt: now }
          : {}),
        ...(updateData.status === "pending"
          ? { completed: false, completedAt: null }
          : {}),
      };

      const data = await updateTask(id, payload);

      // Merge server response — always preserve existing task fields
      setTasks((prev) =>
        prev.map((t) => {
          if (t._id !== id) return t;
          return normaliseTask(data, t);
        })
      );

      return { success: true };
    } catch (err) {
      const message = parseError(err);
      setError(message);
      // Revert on failure
      loadTasks();
      return { success: false, message };
    }
  }, [loadTasks]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    tasks,
    loading,
    actionLoading,
    error,
    loadTasks,
    addTask,
    removeTask,
    editTask,
    clearError,
  }), [tasks, loading, actionLoading, error,
      loadTasks, addTask, removeTask, editTask, clearError]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
};