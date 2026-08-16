import api from "../../../configs/api.js";

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);

  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);

  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");

  return data;
};

export const rotateToken = async () => {
  const { data } = await api.post("/auth/rotate-token");

  return data;
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout");

  return data;
};