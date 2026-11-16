import api from "@/lib/axios";

export const authApi = {
  health: () => api.get("/health").then((response) => response.data),
  register: (body) => api.post("/auth/register", body).then((response) => response.data),
  login: (body) => api.post("/auth/login", body).then((response) => response.data),
  refresh: () => api.post("/auth/refresh").then((response) => response.data),
  logout: () => api.post("/auth/logout").then((response) => response.data),
  logoutAll: () => api.post("/auth/logout-all").then((response) => response.data),
  me: () => api.get("/auth/me").then((response) => response.data),
  updateMe: (body) => api.patch("/auth/me", body).then((response) => response.data),
  changePassword: (body) => api.post("/auth/change-password", body).then((response) => response.data),
  forgotPassword: (body) => api.post("/auth/forgot-password", body).then((response) => response.data),
  resetPassword: (body) => api.post("/auth/reset-password", body).then((response) => response.data),
  verifyEmail: (body) => api.post("/auth/verify-email", body).then((response) => response.data),
  resendVerification: (body) => api.post("/auth/resend-verification", body).then((response) => response.data),
  sessions: () => api.get("/auth/sessions").then((response) => response.data),
  revokeSession: (sessionId) =>
    api.delete(`/auth/sessions/${encodeURIComponent(sessionId)}`).then((response) => response.data),
  exchangeOAuthCode: (body) =>
    api.post("/auth/oauth/exchange", body).then((response) => response.data),
  beginOAuth: (provider) => {
    window.location.href = `${api.defaults.baseURL}/auth/${provider}`;
  },
};
