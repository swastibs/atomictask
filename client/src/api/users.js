import axiosInstance from "./axios";

const unwrapUser = (response) => response.data.data.user || response.data.data;

export const userApi = {
  profile: () => axiosInstance.get("/users/profile").then(unwrapUser),
  updateProfile: (payload) =>
    axiosInstance.patch("/users/profile", payload).then(unwrapUser),
};
