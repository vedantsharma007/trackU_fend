// These key names must never change — changing them logs everyone out
const TOKEN_KEY         = "tracku_token";
const REFRESH_TOKEN_KEY = "tracku_refresh_token";
const THEME_KEY         = "tracku_theme";

// ─── Access token ─────────────────────────────────
export const getToken        = () => localStorage.getItem(TOKEN_KEY);
export const setToken        = (t) => localStorage.setItem(TOKEN_KEY, t);
export const removeToken     = () => localStorage.removeItem(TOKEN_KEY);
export const isAuthenticated = () => !!localStorage.getItem(TOKEN_KEY);

// ─── Refresh token ────────────────────────────────
export const getRefreshToken    = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken    = (t) => localStorage.setItem(REFRESH_TOKEN_KEY, t);
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);

// ─── Theme ────────────────────────────────────────
export const getTheme = () => localStorage.getItem(THEME_KEY) || "dark";
export const setTheme = (t) => localStorage.setItem(THEME_KEY, t);