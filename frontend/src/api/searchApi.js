import axiosClient from "./axiosClient.js";

// global search across students, faculty, events, assignments, placements
export const searchEverything = (query, type) =>
  axiosClient.get("/search", { params: { q: query, type } }).then((res) => res.data.results);
