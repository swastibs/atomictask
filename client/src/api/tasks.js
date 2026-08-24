import axiosInstance from "./axios";

const data = (response) => response.data.data;
const normalizeDueDate = (value) =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T23:59:59.999`
    : value;
const backendPayload = (payload) => ({
  ...payload,
  priority: payload.priority === "urgent" ? "URGENT" : payload.priority,
  dueDate: normalizeDueDate(payload.dueDate),
});

export const taskApi = {
  list: (params, signal) =>
    axiosInstance
      .get("/tasks", { params: backendPayload(params), signal })
      .then((response) => ({
        tasks: data(response) || [],
        pagination: response.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0,
        },
      })),
  get: (id) => axiosInstance.get(`/tasks/${id}`).then(data),
  create: (payload) =>
    axiosInstance.post("/tasks", backendPayload(payload)).then(data),
  update: (id, payload) =>
    axiosInstance.patch(`/tasks/${id}`, backendPayload(payload)).then(data),
  remove: (id) => axiosInstance.delete(`/tasks/${id}`).then(data),
  restore: (id) => axiosInstance.patch(`/tasks/${id}/restore`).then(data),
  permanentRemove: (id) =>
    axiosInstance.delete(`/tasks/${id}/permanent`).then(data),
  trash: () => axiosInstance.get("/tasks/trash").then(data),
  subtasks: (id) => axiosInstance.get(`/tasks/${id}/subtasks`).then(data),
  comments: (id) => axiosInstance.get(`/tasks/${id}/comments`).then(data),
  addComment: (id, body) =>
    axiosInstance.post(`/tasks/${id}/comments`, { body }).then(data),
  addAssignees: (id, userIds) =>
    axiosInstance.post(`/tasks/${id}/assignees`, { userIds }).then(data),
  removeAssignee: (id, userId) =>
    axiosInstance.delete(`/tasks/${id}/assignees/${userId}`).then(data),
  bulkUpdate: (ids, updateData) =>
    axiosInstance
      .post("/tasks/bulk-update", {
        ids,
        updateData: backendPayload(updateData),
      })
      .then(data),
  bulkDelete: (ids) =>
    axiosInstance.delete("/tasks/bulk", { data: { ids } }).then(data),
  stats: () => axiosInstance.get("/tasks/stats").then(data),
};

export const apiError = (error) =>
  error.normalized?.message ||
  error.response?.data?.message ||
  error.message ||
  "Request failed";
