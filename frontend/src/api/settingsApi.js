import axiosClient from "./axiosClient.js";

// per-user preferences (theme, notification prefs) + danger-zone account deletion

export const getMySettings = () =>
  axiosClient.get("/settings").then((res) => res.data.settings);

export const updateMySettings = (changes) =>
  axiosClient.patch("/settings", changes).then((res) => res.data.settings);

export const deleteMyAccount = () =>
  axiosClient.delete("/settings/me").then((res) => res.data);
