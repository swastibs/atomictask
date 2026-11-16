import axios from "axios";
import { toast } from "sonner";
import { config } from "@/config";

let accessToken = null;
let clearAuth = () => {};
let refreshing = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const registerAuthClear = (callback) => {
  clearAuth = callback;
};

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  timeout: 15_000,
});

api.interceptors.request.use((request) => {
  if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
});

const noRefreshRoutes = [
  "/auth/login",
  "/auth/refresh",
  "/auth/register",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const url = request?.url || "";
    const status = error.response?.status;

    if (status === 429) {
      const retryAfter = Number(error.response?.headers?.["retry-after"]);
      const resetAfter = Number(error.response?.headers?.["ratelimit-reset"]);
      const seconds = retryAfter > 0
        ? retryAfter
        : resetAfter > 0
          ? Math.ceil(resetAfter)
          : null;
      toast.error(
        seconds
          ? `Too many tries. Try again in ${seconds} seconds.`
          : error.response?.data?.message || "Too many attempts. Try again soon.",
      );
    }

    const excluded = noRefreshRoutes.some((route) => url.includes(route));
    if (status !== 401 || !request || request._retry || excluded) {
      return Promise.reject(error);
    }

    request._retry = true;
    refreshing ||= api
      .post("/auth/refresh")
      .then((response) => {
        const token = response.data?.data?.accessToken;
        if (!token) throw new Error("Session refresh did not return an access token.");
        setAccessToken(token);
        return token;
      })
      .catch(() => null)
      .finally(() => {
        refreshing = null;
      });

    const token = await refreshing;
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
      return api(request);
    }

    clearAuth();
    toast.error("Your session expired. Sign in again to pick up where you left off.");
    if (!window.location.pathname.startsWith("/login")) {
      window.location.assign("/login?reason=session_expired");
    }
    return Promise.reject(error);
  },
);

export default api;
