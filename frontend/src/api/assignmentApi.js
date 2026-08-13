import axiosClient from "./axiosClient.js";

// assignment creation (faculty) and submission (student) flows

export const createAssignment = (payload) =>
  axiosClient.post("/assignments", payload).then((res) => res.data.assignment);

export const getAssignmentsForCourse = (courseId) =>
  axiosClient.get(`/assignments/course/${courseId}`).then((res) => res.data.assignments);

export const getAssignmentById = (assignmentId) =>
  axiosClient.get(`/assignments/${assignmentId}`).then((res) => res.data.assignment);

export const updateAssignment = (assignmentId, changes) =>
  axiosClient.patch(`/assignments/${assignmentId}`, changes).then((res) => res.data.assignment);

export const deleteAssignment = (assignmentId) =>
  axiosClient.delete(`/assignments/${assignmentId}`).then((res) => res.data);

export const submitAssignmentSolution = (assignmentId, payload) =>
  axiosClient
    .post(`/assignments/${assignmentId}/submit`, payload)
    .then((res) => res.data.submission);

export const getAssignmentSubmissions = (assignmentId) =>
  axiosClient.get(`/assignments/${assignmentId}/submissions`).then((res) => res.data.submissions);

export const reviewSubmission = (submissionId, marksAndFeedback) =>
  axiosClient
    .patch(`/assignments/submissions/${submissionId}/review`, marksAndFeedback)
    .then((res) => res.data.submission);

export const getMySubmissions = () =>
  axiosClient.get("/assignments/me/submissions").then((res) => res.data.submissions);
