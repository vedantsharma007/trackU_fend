import axios from "axios";
import {
  getToken,
  removeToken,
  getRefreshToken as readRefreshToken,
  setToken,
  setRefreshToken as saveRefreshToken,
  removeRefreshToken,
} from "../utils/tokenUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor ──────────────────────────
// Reads token fresh from localStorage on EVERY request
// so it always has the latest value even after token refresh
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken(); // reads localStorage directly — always fresh
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — auto refresh on 401 ──
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else       p.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = "Bearer " + token;
          return axiosInstance(original);
        }).catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing    = true;

      const refreshToken = readRefreshToken();

      if (!refreshToken) {
        isRefreshing = false;
        removeToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          BASE_URL + "/auth/refresh",
          { refreshToken }
        );

        const newAccess  = data.accessToken;
        const newRefresh = data.refreshToken;

        setToken(newAccess);
        if (newRefresh) saveRefreshToken(newRefresh);

        axiosInstance.defaults.headers.Authorization = "Bearer " + newAccess;
        original.headers.Authorization               = "Bearer " + newAccess;

        processQueue(null, newAccess);
        return axiosInstance(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;