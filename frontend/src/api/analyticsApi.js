import axiosClient from "./axiosClient.js";

// admin analytics + department/course management + audit logs

export const getOverviewStats = () =>
    axiosClient.get("/analytics/overview").then((res) => res.data.overview);

export const getAttendanceAnalytics = () =>
    axiosClient.get("/analytics/attendance").then((res) => res.data.stats);

export const getPlacementAnalytics = () =>
    axiosClient.get("/analytics/placements").then((res) => res.data.stats);

export const getEventAnalytics = () =>
    axiosClient.get("/analytics/events").then((res) => res.data.stats);

// not double-wrapped on the backend (sendSuccess is called with the logs
// payload directly), so no extra unwrap here
export const listActivityLogs = (page) =>
    axiosClient.get("/admin/logs", { params: { page } }).then((res) => res.data);

export const exportEntityAsFile = (entityName) =>
    axiosClient
        .get(`/admin/export/${entityName}`, { responseType: "blob" })
        .then((res) => res.data);

export const listDepartments = () =>
    axiosClient.get("/departments").then((res) => res.data.departments);

export const createDepartment = (payload) =>
    axiosClient.post("/departments", payload).then((res) => res.data.department);

export const listCourses = () =>
    axiosClient.get("/courses").then((res) => res.data.courses);

export const createCourse = (payload) =>
    axiosClient.post("/courses", payload).then((res) => res.data.course);

export const updateCourse = (courseId, payload) =>
    axiosClient.patch(`/courses/${courseId}`, payload).then((res) => res.data.course);

export const listFacultyOptions = () =>
    axiosClient.get("/courses/faculty/options").then((res) => res.data.faculty);

export const getStudentsInCourse = (courseId) =>
    axiosClient.get(`/courses/${courseId}/students`).then((res) => res.data.students);