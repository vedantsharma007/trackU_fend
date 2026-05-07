import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import {
  getToken,
  setToken,
  removeToken,
  getRefreshToken as readRefreshToken,
  setRefreshToken as saveRefreshToken,
  removeRefreshToken,
} from "../utils/tokenUtils";
import { loginUser, registerUser, logoutUser } from "../services/authService";

export const AuthContext = createContext(null);

const parseError = (err) => {
  if (err.response?.data?.errors) {
    return err.response.data.errors.map((e) => e.msg).join(", ");
  }
  return err.response?.data?.message || "Something went wrong";
};

const extractUser = (data) => ({
  _id:   data._id   || data.id || null,
  name:  data.name  || "",
  email: data.email || "",
});

export const AuthProvider = ({ children }) => {
  const [user,    setUser]       = useState(null);
  const [token,   setTokenState] = useState(() => getToken());
  const [loading, setLoading]    = useState(false);
  const [error,   setError]      = useState(null);

  // Sync token state → localStorage
  useEffect(() => {
    if (token) {
      setToken(token);
    } else {
      removeToken();
    }
  }, [token]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(credentials);
      setTokenState(data.accessToken);
      if (data.refreshToken) saveRefreshToken(data.refreshToken);
      setUser(extractUser(data));
      return { success: true };
    } catch (err) {
      const message = parseError(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(formData);
      setTokenState(data.accessToken);
      if (data.refreshToken) saveRefreshToken(data.refreshToken);
      setUser(extractUser(data));
      return { success: true };
    } catch (err) {
      const message = parseError(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (_) {
      // still clear local state
    } finally {
      setTokenState(null);
      setUser(null);
      removeToken();
      removeRefreshToken();
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    error,
    // KEY FIX: derive isAuthenticated from token STATE (React state)
    // not from localStorage directly — prevents flicker on re-render
    isAuthenticated: !!token,
    login,
    register,
    logout,
    clearError,
  }), [user, token, loading, error, login, register, logout, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};