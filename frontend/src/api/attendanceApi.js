import axiosClient from "./axiosClient.js";

// attendance sessions, QR self-mark, history and reports

export const createAttendanceSession = (payload) =>
  axiosClient.post("/attendance/sessions", payload).then((res) => res.data);

export const getSessionsForCourse = (courseId) =>
  axiosClient.get(`/attendance/sessions/${courseId}`).then((res) => res.data);

export const markStudentPresent = (sessionId, studentId, status) =>
  axiosClient
    .post(`/attendance/sessions/${sessionId}/mark`, { studentId, status })
    .then((res) => res.data);

export const scanAttendanceQrCode = (sessionId, qrToken) =>
  axiosClient
    .post(`/attendance/sessions/${sessionId}/scan`, { qrToken })
    .then((res) => res.data);

export const getMyAttendanceHistory = () =>
  axiosClient.get("/attendance/me/history").then((res) => res.data);

export const getMyAttendanceSummary = () =>
  axiosClient.get("/attendance/me/summary").then((res) => res.data);

export const getCourseAttendanceReport = (courseId) =>
  axiosClient.get(`/attendance/reports/${courseId}`).then((res) => res.data);

export const getMonthlyAttendanceReport = () =>
  axiosClient.get("/attendance/reports/monthly").then((res) => res.data);
