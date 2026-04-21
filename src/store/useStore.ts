import { create } from 'zustand'

export type AdminTab = 'dashboard' | 'products' | 'categories' | 'content' | 'settings'

interface AppState {
  adminTab: AdminTab
  setAdminTab: (tab: AdminTab) => void
}

export const useStore = create<AppState>((set) => ({
  adminTab: 'dashboard',
  setAdminTab: (tab) => {
    set({ adminTab: tab })
  },
}))
