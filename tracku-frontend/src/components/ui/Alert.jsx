const Alert = ({ message, type = "error", onClose }) => {
  if (!message) return null;

  const config = {
    error: {
      bg: "var(--error-dim)",
      border: "rgba(248,113,113,0.25)",
      color: "var(--error)",
      icon: "✕",
    },
    success: {
      bg: "var(--success-dim)",
      border: "rgba(52,211,153,0.25)",
      color: "var(--success)",
      icon: "✓",
    },
  };

  const c = config[type] || config.error;

  return (
    <div
      style={{
        ...styles.wrapper,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
      }}
    >
      <span style={styles.icon}>{c.icon}</span>
      <span style={styles.message}>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ ...styles.closeBtn, color: c.color }}>
          ✕
        </button>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "12px 14px",
    borderRadius: "var(--radius)",
    fontSize: "13.5px",
    fontWeight: "500",
    lineHeight: "1.5",
    width: "100%",
  },
  icon: {
    flexShrink: 0,
    marginTop: "1px",
    fontSize: "12px",
  },
  message: {
    flex: 1,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
    flexShrink: 0,
    opacity: 0.7,
    padding: "0 2px",
  },
};

export default Alert;