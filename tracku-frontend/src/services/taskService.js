import axiosInstance from "../api/axiosInstance";

export const fetchTasks = async () => {
  const response = await axiosInstance.get("/tasks");
  return response.data;
};

export const createTask = async (data) => {
  const response = await axiosInstance.post("/tasks", data);
  return response.data;
};

/**
 * Update task — used for status toggle (mark complete) and edits
 * Sends PATCH-safe partial payload
 */
export const updateTask = async (id, data) => {
  const response = await axiosInstance.put(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axiosInstance.delete(`/tasks/${id}`);
  return response.data;
};