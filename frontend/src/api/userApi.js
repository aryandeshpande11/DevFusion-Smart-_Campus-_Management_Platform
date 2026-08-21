import axiosClient from "./axiosClient.js";

// profile self-service (/api/users/me) plus admin user management (/api/users)

export const getMyProfile = () =>
    axiosClient.get("/users/me").then((res) => res.data.user);

export const updateMyProfile = (changes) =>
    axiosClient.patch("/users/me", changes).then((res) => res.data.user);

export const uploadMyAvatar = (fileData) => {
    const formData = new FormData();
    formData.append("avatar", fileData);
    return axiosClient
        .post("/users/me/avatar", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data.avatarUrl);
};

export const uploadMyResume = (fileData) => {
    const formData = new FormData();
    formData.append("resume", fileData);
    return axiosClient
        .post("/users/me/resume", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => res.data.resumeUrl);
};

export const listAllUsers = (queryParams) =>
    axiosClient.get("/users", { params: queryParams }).then((res) => res.data.users);

export const getUserById = (userId) =>
    axiosClient.get(`/users/${userId}`).then((res) => res.data.user);

export const listRoles = () =>
    axiosClient.get("/users/roles/list").then((res) => res.data.roles);

export const changeUserRole = (userId, newRoleId) =>
    axiosClient.patch(`/users/${userId}/role`, { roleId: newRoleId }).then((res) => res.data.user);

export const setUserActiveStatus = (userId, isActive) =>
    axiosClient
        .patch(`/users/${userId}/status`, { isActive })
        .then((res) => res.data.user);

export const deleteUserAccount = (userId) =>
    axiosClient.delete(`/users/${userId}`).then((res) => res.data);