import Spinner from "./Spinner";

const Button = ({
  children,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  variant = "primary",
  fullWidth = false,
  style: extraStyle = {},
}) => {
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: {
      background: "var(--accent)",
      color: "#fff",
      border: "none",
    },
    ghost: {
      background: "transparent",
      color: "var(--accent)",
      border: "1px solid var(--border)",
    },
    danger: {
      background: "var(--error-dim)",
      color: "var(--error)",
      border: "1px solid rgba(248,113,113,0.2)",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      style={{
        ...styles.base,
        ...(variantStyles[variant] || variantStyles.primary),
        ...(fullWidth ? { width: "100%" } : {}),
        ...(isDisabled ? styles.disabled : {}),
        ...extraStyle,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled && variant === "primary") {
          e.currentTarget.style.background = "var(--accent-hover)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled && variant === "primary") {
          e.currentTarget.style.background = "var(--accent)";
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      {loading ? (
        <span style={styles.loadingWrapper}>
          <Spinner size={16} color="#fff" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

const styles = {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "11px 22px",
    borderRadius: "var(--radius)",
    fontSize: "14px",
    fontWeight: "600",
    fontFamily: "var(--font-body)",
    letterSpacing: "0.01em",
    transition: "var(--transition)",
    cursor: "pointer",
    gap: "8px",
  },
  disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    transform: "none",
  },
  loadingWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};

export default Button;