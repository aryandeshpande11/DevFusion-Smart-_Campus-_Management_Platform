import axiosClient from "./axiosClient.js";

// everything under /api/auth — signup, login, google oauth, otp flow

export const signUpWithEmail = (formValues) =>
  axiosClient.post("/auth/signup", formValues).then((res) => res.data);

export const logInWithEmail = (credentials) =>
  axiosClient.post("/auth/login", credentials).then((res) => res.data);

export const logInWithGoogle = (googleToken) =>
  axiosClient.post("/auth/google/callback", { googleToken }).then((res) => res.data);

export const verifyEmailToken = (token) =>
  axiosClient.post("/auth/verify-email", { token }).then((res) => res.data);

export const resendVerificationEmail = (email) =>
  axiosClient.post("/auth/resend-verification", { email }).then((res) => res.data);

export const requestPasswordReset = (email) =>
  axiosClient.post("/auth/forgot-password", { email }).then((res) => res.data);

export const verifyResetOtp = (email, otp) =>
  axiosClient.post("/auth/verify-otp", { email, otp }).then((res) => res.data);

export const resetPassword = (payload) =>
  axiosClient.post("/auth/reset-password", payload).then((res) => res.data);

export const logOutCurrentUser = () =>
  axiosClient.post("/auth/logout").then((res) => res.data);

export const fetchLoggedInUser = () =>
  axiosClient.get("/auth/me").then((res) => res.data);
