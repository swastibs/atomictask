const apiUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:8080/api"
).replace(/\/+$/, "");

export const config = {
  apiUrl,
  clientUrl: import.meta.env.VITE_CLIENT_URL || window.location.origin,
  projectName: "AtomicTasks",
  oauth: {
    google: import.meta.env.VITE_GOOGLE_OAUTH_ENABLED === "true",
    github: import.meta.env.VITE_GITHUB_OAUTH_ENABLED === "true",
  },
};
