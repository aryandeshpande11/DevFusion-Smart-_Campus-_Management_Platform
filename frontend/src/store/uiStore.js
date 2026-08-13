import { create } from "zustand";
import { persist } from "zustand/middleware";

// tracks purely visual state — dark/light mode and whether the sidebar
// is collapsed — nothing here needs to touch the backend
export const useUiStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      isSidebarCollapsed: false,

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    }),
    { name: "campus-connect-ui" }
  )
);
