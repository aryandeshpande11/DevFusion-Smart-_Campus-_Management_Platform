import axiosClient from "./axiosClient.js";

// student clubs — creation, membership requests and approvals

export const createClub = (payload) =>
  axiosClient.post("/clubs", payload).then((res) => res.data);

export const listClubs = () =>
  axiosClient.get("/clubs").then((res) => res.data);

export const updateClub = (clubId, changes) =>
  axiosClient.patch(`/clubs/${clubId}`, changes).then((res) => res.data);

export const deleteClub = (clubId) =>
  axiosClient.delete(`/clubs/${clubId}`).then((res) => res.data);

export const joinClub = (clubId) =>
  axiosClient.post(`/clubs/${clubId}/join`).then((res) => res.data);

export const decideMembership = (clubId, memberUserId, decision) =>
  axiosClient
    .patch(`/clubs/${clubId}/members/${memberUserId}`, { decision })
    .then((res) => res.data);

export const getClubMembers = (clubId) =>
  axiosClient.get(`/clubs/${clubId}/members`).then((res) => res.data);
