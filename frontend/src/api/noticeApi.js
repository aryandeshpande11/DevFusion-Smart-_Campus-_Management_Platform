import axiosClient from "./axiosClient.js";

// role/department-targeted notices and announcements

export const publishNotice = (payload) =>
  axiosClient.post("/notices", payload).then((res) => res.data.notice);

export const listNotices = () =>
  axiosClient.get("/notices").then((res) => res.data.notices);

export const deleteNotice = (noticeId) =>
  axiosClient.delete(`/notices/${noticeId}`).then((res) => res.data);
