import axios from "axios";
import { useAuthStore } from "../store/authStore.js";

// single axios instance every api/*.js file shares, pointed at the
// Express backend described in the system design (/api/auth, /api/users...)
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true, // needed for the httpOnly refresh-token cookie
});

// attach the short-lived access token to every outgoing request
axiosClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// on a 401, try once to refresh the access token before giving up
let isRefreshing = false;
let pendingQueue = [];

const resolvePendingQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

axiosClient.interceptors.response.use(
    (response) => {
      // backend replies as { success, message, data } — unwrap it here, once,
      // so every api/*.js file can keep doing `.then((res) => res.data)` and
      // get the actual payload instead of the envelope around it
      if (response.data && typeof response.data === "object" && "success" in response.data) {
        response.data = response.data.data;
      }
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const isAuthRoute = originalRequest?.url?.includes("/auth/");

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axiosClient.post("/auth/refresh-token");
          useAuthStore.getState().setAccessToken(data.accessToken);
          resolvePendingQueue(null, data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          resolvePendingQueue(refreshError, null);
          useAuthStore.getState().clearSession();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
);

export default axiosClient;