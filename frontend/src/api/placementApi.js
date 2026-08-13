import axiosClient from "./axiosClient.js";

// placement postings and student applications

export const createPlacementPosting = (payload) =>
  axiosClient.post("/placements", payload).then((res) => res.data.placement);

export const listPlacementPostings = () =>
  axiosClient.get("/placements").then((res) => res.data.placements);

export const getPlacementById = (placementId) =>
  axiosClient.get(`/placements/${placementId}`).then((res) => res.data.placement);

export const updatePlacementPosting = (placementId, changes) =>
  axiosClient.patch(`/placements/${placementId}`, changes).then((res) => res.data.placement);

export const deletePlacementPosting = (placementId) =>
  axiosClient.delete(`/placements/${placementId}`).then((res) => res.data);

export const applyToPlacement = (placementId, payload) =>
  axiosClient.post(`/placements/${placementId}/apply`, payload).then((res) => res.data.application);

export const getPlacementApplications = (placementId) =>
  axiosClient.get(`/placements/${placementId}/applications`).then((res) => res.data.applications);

export const updateApplicationStatus = (applicationId, status) =>
  axiosClient
    .patch(`/placements/applications/${applicationId}/status`, { status })
    .then((res) => res.data.application);

export const getMyApplications = () =>
  axiosClient.get("/placements/me/applications").then((res) => res.data.applications);
