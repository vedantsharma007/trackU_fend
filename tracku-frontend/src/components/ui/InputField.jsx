import { useState } from "react";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div style={styles.wrapper}>
      {label && (
        <label htmlFor={name} style={styles.label}>
          {label}
        </label>
      )}
      <div style={styles.inputWrapper}>
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          style={{
            ...styles.input,
            ...(error ? styles.inputError : {}),
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error
              ? "var(--error)"
              : "var(--border-focus)";
            e.target.style.background = "rgba(255,255,255,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error
              ? "var(--error)"
              : "var(--border)";
            e.target.style.background = "rgba(255,255,255,0.03)";
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            style={styles.eyeBtn}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon />
            ) : (
              <EyeIcon />
            )}
          </button>
        )}
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
};

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    width: "100%",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "var(--text-secondary)",
    letterSpacing: "0.02em",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text-primary)",
    fontSize: "14px",
    transition: "var(--transition)",
    WebkitAppearance: "none",
  },
  inputError: {
    borderColor: "var(--error)",
    background: "var(--error-dim)",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    display: "flex",
    alignItems: "center",
    padding: "4px",
    transition: "var(--transition)",
  },
  errorText: {
    fontSize: "12px",
    color: "var(--error)",
    marginTop: "2px",
  },
};

export default InputField;