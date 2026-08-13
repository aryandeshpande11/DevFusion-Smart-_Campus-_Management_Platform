import axiosClient from "./axiosClient.js";

// in-app notification inbox

export const listMyNotifications = () =>
  axiosClient.get("/notifications").then((res) => res.data);

export const markNotificationRead = (notificationId) =>
  axiosClient.patch(`/notifications/${notificationId}/read`).then((res) => res.data);

export const markAllNotificationsRead = () =>
  axiosClient.patch("/notifications/read-all").then((res) => res.data);

export const deleteNotification = (notificationId) =>
  axiosClient.delete(`/notifications/${notificationId}`).then((res) => res.data);
