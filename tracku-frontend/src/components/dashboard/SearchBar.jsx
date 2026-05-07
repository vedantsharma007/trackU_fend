const SearchBar = ({ value, onChange, resultCount, totalCount }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.inputWrapper}>
        <SearchIcon />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search tasks by title or description…"
          style={styles.input}
          onFocus={(e) => {
            e.target.parentElement.style.borderColor = "var(--border-focus)";
          }}
          onBlur={(e) => {
            e.target.parentElement.style.borderColor = "var(--border)";
          }}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            style={styles.clearBtn}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {value && (
        <p style={styles.resultText}>
          {resultCount} of {totalCount} task{totalCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
};

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ color: "var(--text-muted)", flexShrink: 0 }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 14px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    transition: "var(--transition)",
  },
  input: {
    flex: 1,
    padding: "11px 0",
    background: "transparent",
    border: "none",
    color: "var(--text-primary)",
    fontSize: "14px",
    fontFamily: "var(--font-body)",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    fontSize: "12px",
    padding: "4px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    transition: "var(--transition)",
  },
  resultText: {
    fontSize: "12px",
    color: "var(--text-muted)",
    paddingLeft: "4px",
  },
};

export default SearchBar;