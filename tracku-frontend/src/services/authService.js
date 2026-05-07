import axiosInstance from "../api/axiosInstance";

/**
 * Register a new user
 * @param {Object} data - { name, email, password }
 */
export const registerUser = async (data) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

/**
 * Login an existing user
 * @param {Object} data - { email, password }
 */
export const loginUser = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

/**
 * Logout — calls backend to invalidate refresh token (if used)
 */
export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};