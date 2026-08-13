import axiosClient from "./axiosClient.js";

// campus events — creation, browsing, registration and check-in

export const createEvent = (payload) =>
  axiosClient.post("/events", payload).then((res) => res.data);

export const listEvents = (filters) =>
  axiosClient.get("/events", { params: filters }).then((res) => res.data);

export const getEventById = (eventId) =>
  axiosClient.get(`/events/${eventId}`).then((res) => res.data);

export const updateEvent = (eventId, changes) =>
  axiosClient.patch(`/events/${eventId}`, changes).then((res) => res.data);

export const deleteEvent = (eventId) =>
  axiosClient.delete(`/events/${eventId}`).then((res) => res.data);

export const registerForEvent = (eventId) =>
  axiosClient.post(`/events/${eventId}/register`).then((res) => res.data);

export const cancelEventRegistration = (eventId) =>
  axiosClient.delete(`/events/${eventId}/register`).then((res) => res.data);

export const getMyEventTicket = (eventId) =>
  axiosClient.get(`/events/${eventId}/ticket`).then((res) => res.data);

export const getEventAttendees = (eventId) =>
  axiosClient.get(`/events/${eventId}/attendees`).then((res) => res.data);

export const checkInAttendee = (eventId, qrPassCode) =>
  axiosClient
    .post(`/events/${eventId}/checkin`, { qrPassCode })
    .then((res) => res.data);
