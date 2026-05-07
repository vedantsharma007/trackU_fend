import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  getTheme,
  setTheme as saveTheme,   // renamed to avoid conflict with state setter
} from "../utils/tokenUtils";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Use function form for useState initializer — avoids calling getTheme on every render
  const [theme, setThemeState] = useState(() => getTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    isDark: theme === "dark",
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};