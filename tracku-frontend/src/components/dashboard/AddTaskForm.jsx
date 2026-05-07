import { useState } from "react";
import { useTasks } from "../../context/TaskContext";
import Button from "../ui/Button";

const PRIORITIES = ["low", "medium", "high"];

const RECURRING_OPTIONS = [
  { value: "none",    label: "One-time", icon: "○" },
  { value: "daily",   label: "Daily",    icon: "↻" },
  { value: "weekly",  label: "Weekly",   icon: "↻" },
  { value: "monthly", label: "Monthly",  icon: "↻" },
];

const EMPTY_FORM = {
  title:       "",
  description: "",
  priority:    "medium",
  dueDate:     "",
  recurring:   "none",
};

const AddTaskForm = ({ onSuccess }) => {
  const { addTask, actionLoading } = useTasks();
  const [open,        setOpen]        = useState(false);
  const [form,        setForm]        = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((p) => ({ ...p, [name]: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.title.trim())              errors.title = "Title is required";
    else if (form.title.trim().length < 2) errors.title = "Min 2 characters";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    const payload = {
      title:       form.title.trim(),
      description: form.description.trim(),
      priority:    form.priority,
      recurring:   form.recurring,
      ...(form.dueDate && { dueDate: form.dueDate }),
    };
    const result = await addTask(payload);
    if (result.success) {
      setForm(EMPTY_FORM);
      setFieldErrors({});
      setOpen(false);
      onSuccess?.();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setForm(EMPTY_FORM);
    setFieldErrors({});
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={styles.trigger}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-focus)";
          e.currentTarget.style.color       = "var(--text-primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.color       = "var(--text-secondary)";
        }}
      >
        <span style={styles.triggerPlus}>+</span>
        Add new task
      </button>
    );
  }

  return (
    <div style={styles.formCard} className="animate-slideDown">
      <div style={styles.formHeader}>
        <h3 style={styles.formTitle}>New Task</h3>
        <button onClick={handleCancel} style={styles.closeBtn}>✕</button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form} noValidate>

        {/* Title */}
        <div style={styles.field}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="What needs to be done? *"
            autoFocus
            style={{
              ...styles.input,
              ...(fieldErrors.title ? styles.inputError : {}),
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--border-focus)")}
            onBlur={(e)  => (e.target.style.borderColor = fieldErrors.title
              ? "var(--error)" : "var(--border)")}
          />
          {fieldErrors.title && (
            <p style={styles.fieldError}>{fieldErrors.title}</p>
          )}
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add details (optional)"
          rows={2}
          style={styles.textarea}
          onFocus={(e) => (e.target.style.borderColor = "var(--border-focus)")}
          onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
        />

        {/* Priority + Due date */}
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              style={styles.select}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Due date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "var(--border-focus)")}
              onBlur={(e)  => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>

        {/* Recurring */}
        <div style={styles.field}>
          <label style={styles.label}>Repeat</label>
          <div style={styles.recurringRow}>
            {RECURRING_OPTIONS.map((opt) => {
              const isActive = form.recurring === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, recurring: opt.value }))
                  }
                  style={{
                    ...styles.recurringBtn,
                    ...(isActive ? styles.recurringBtnActive : {}),
                  }}
                >
                  <span style={styles.recurringIcon}>{opt.icon}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={styles.formActions}>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={actionLoading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={actionLoading}>
            Add Task
          </Button>
        </div>
      </form>
    </div>
  );
};

// ─── Styles — all use CSS vars for theme compat ───
const styles = {
  trigger: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "13px 16px",
    background: "var(--bg-card)",
    border: "1px dashed var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-secondary)",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "var(--transition)",
    fontFamily: "var(--font-body)",
  },
  triggerPlus: {
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    background: "var(--accent-dim)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    lineHeight: 1,
    flexShrink: 0,
  },
  formCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-focus)",
    borderRadius: "var(--radius)",
    padding: "20px",
    boxShadow: "var(--shadow)",
  },
  formHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
  },
  formTitle: {
    fontSize: "15px",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    color: "var(--text-primary)",
    letterSpacing: "-0.01em",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px 6px",
    borderRadius: "6px",
    lineHeight: 1,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "13px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  label: {
    fontSize: "11px",
    color: "var(--text-muted)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  input: {
    padding: "10px 13px",
    background: "var(--bg-card)",
    borderWidth: "1px",        // ← split border into parts
    borderStyle: "solid",
    borderColor: "var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)",
    fontSize: "14px",
    transition: "var(--transition)",
    width: "100%",
    fontFamily: "var(--font-body)",
  },
  inputError: {
    borderColor: "var(--error)",
    background: "var(--error-dim)",
  },
  textarea: {
    padding: "10px 13px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)",
    fontSize: "14px",
    transition: "var(--transition)",
    resize: "vertical",
    fontFamily: "var(--font-body)",
    minHeight: "62px",
  },
  select: {
    padding: "10px 13px",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)",
    fontSize: "14px",
    width: "100%",
    fontFamily: "var(--font-body)",
    cursor: "pointer",
    appearance: "auto",
  },
  row: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  recurringRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  recurringBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "7px 13px",
    borderRadius: "20px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    color: "var(--text-secondary)",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "var(--transition)",
    fontFamily: "var(--font-body)",
  },
  recurringBtnActive: {
    background: "var(--accent-dim)",
    borderColor: "rgba(99,102,241,0.4)",
    color: "var(--accent)",
    fontWeight: "600",
  },
  recurringIcon: {
    fontSize: "13px",
    lineHeight: 1,
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "4px",
  },
  fieldError: {
    fontSize: "12px",
    color: "var(--error)",
  },
};

export default AddTaskForm;