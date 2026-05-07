import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import Button from "../ui/Button";

const NAV_LINKS = [
  { path: "/dashboard", label: "Tasks",    icon: "◫" },
  { path: "/progress",  label: "Progress", icon: "↗" },
];

const DashboardHeader = ({ taskCount }) => {
  const { user, logout }            = useAuth();
  const { isDark, toggleTheme }     = useTheme();
  const location                    = useLocation();
  const navigate                    = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  const displayName = user?.name || "there";
  const initial     = displayName.charAt(0).toUpperCase();

  return (
    <header style={styles.header}>
      {/* Logo + Nav */}
      <div style={styles.left}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>T</div>
          <span style={styles.logoText}>TrackU</span>
        </div>

        <nav style={styles.nav}>
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{
                  ...styles.navBtn,
                  ...(isActive ? styles.navBtnActive : {}),
                }}
              >
                <span style={styles.navIcon}>{link.icon}</span>
                <span className="hide-mobile">{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right */}
      <div style={styles.right}>
        {/* Task count pill */}
        <div style={styles.pill} className="hide-mobile">
          <span style={styles.pillDot} />
          <span>{taskCount} task{taskCount !== 1 ? "s" : ""}</span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={styles.themeBtn}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Avatar + name */}
        <div style={styles.userChip}>
          <div style={styles.avatar}>{initial}</div>
          <div style={styles.userMeta} className="hide-mobile">
            <span style={styles.userName}>{displayName}</span>
            {user?.email && (
              <span style={styles.userEmail}>{user.email}</span>
            )}
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          loading={loggingOut}
          style={{ padding: "7px 14px", fontSize: "12px", borderRadius: "var(--radius-sm)" }}
        >
          <LogoutIcon />
          <span className="hide-mobile">Sign out</span>
        </Button>
      </div>
    </header>
  );
};

/* ─── Icons ──────────────────────────────────────── */
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"  x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1"  y1="12" x2="3"  y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

/* ─── Styles ─────────────────────────────────────── */
const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    height: "60px",
    background: "var(--header-bg)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 20,
    gap: "12px",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  logoMark: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "var(--accent)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontFamily: "var(--font-display)",
    fontWeight: "800",
    boxShadow: "0 0 12px var(--accent-glow)",
  },
  logoText: {
    fontSize: "16px",
    fontFamily: "var(--font-display)",
    fontWeight: "700",
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 13px",
    borderRadius: "var(--radius-sm)",
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "var(--transition)",
    fontFamily: "var(--font-body)",
    whiteSpace: "nowrap",
  },
  navBtnActive: {
    background: "var(--accent-dim)",
    color: "var(--accent)",
    fontWeight: "600",
  },
  navIcon: {
    fontSize: "14px",
    lineHeight: 1,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  pill: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "5px 12px",
    background: "var(--accent-dim)",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--accent)",
    border: "1px solid rgba(99,102,241,0.2)",
  },
  pillDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "var(--accent)",
    animation: "pulse 2s ease-in-out infinite",
    flexShrink: 0,
  },
  themeBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "var(--radius-sm)",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "var(--transition)",
    flexShrink: 0,
  },
  userChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "var(--accent-dim)",
    border: "1.5px solid rgba(99,102,241,0.4)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    fontFamily: "var(--font-display)",
    flexShrink: 0,
  },
  userMeta: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.2,
  },
  userName: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  userEmail: {
    fontSize: "10px",
    color: "var(--text-muted)",
  },
};

export default DashboardHeader;