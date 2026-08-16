import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupApiInterceptors = (store) => {
  api.interceptors.request.use(
    (config) => {
      const accessToken = store.getState().auth.accessToken;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/rotate-token") &&
        !originalRequest.url?.includes("/auth/login") &&
        !originalRequest.url?.includes("/auth/register")
      ) {
        originalRequest._retry = true;
        try {
          const { rotateToken } = await import("../modules/auth/store/authThunk.js");
          const resultAction = await store.dispatch(rotateToken());
          if (rotateToken.fulfilled.match(resultAction)) {
            const newAccessToken = resultAction.payload.accessToken;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;