import { create } from "zustand";
import { persist } from "zustand/middleware";

// holds the signed-in user + short-lived access token; the refresh
// token itself lives in an httpOnly cookie the browser manages for us
export const useAuthStore = create(
  persist(
    (set) => ({
      currentUser: null,
      accessToken: null,

      setAccessToken: (accessToken) => set({ accessToken }),

      startSession: (currentUser, accessToken) =>
        set({ currentUser, accessToken }),

      updateProfile: (changes) =>
        set((state) => ({ currentUser: { ...state.currentUser, ...changes } })),

      clearSession: () => set({ currentUser: null, accessToken: null }),
    }),
    {
      name: "campus-connect-auth",
      partialize: (state) => ({ currentUser: state.currentUser }), // never persist the raw token
    }
  )
);
