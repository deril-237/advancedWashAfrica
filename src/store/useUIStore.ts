import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUIState {
  isSidebarOpen: boolean;
  isMinimized: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  toggleMinimize: () => void;
}

export const useAdminUIStore = create<AdminUIState>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      isMinimized: false,

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      closeSidebar: () => set({ isSidebarOpen: false }),

      toggleMinimize: () =>
        set((state) => ({ isMinimized: !state.isMinimized })),
    }),
    {
      name: "admin-ui-storage",
    },
  ),
);
