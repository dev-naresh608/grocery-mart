import api from "@/configs/api";

export const registerUserApi = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const loginUserApi = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const getMeApi = async () => {
  const { data } = await api.get("/auth/getme");
  return data;
};

export const rotateTokenApi = async () => {
  const { data } = await api.post("/auth/rotate-token");
  return data;
};

export const logoutApi = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

// Aliases for compatibility
export const registerUser = registerUserApi;
export const loginUser = loginUserApi;
export const getMe = getMeApi;
export const rotateToken = rotateTokenApi;
export const logout = logoutApi;
