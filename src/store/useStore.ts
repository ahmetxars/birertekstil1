import { create } from 'zustand'

export type Page = 'home' | 'category' | 'product' | 'admin'
export type AdminTab = 'dashboard' | 'products' | 'categories' | 'content' | 'settings' | 'messages'

interface AppState {
  page: Page
  adminTab: AdminTab
  selectedCategoryId: string | null
  selectedProductId: string | null
  navigate: (page: Page, categoryId?: string | null, productId?: string | null) => void
  setAdminTab: (tab: AdminTab) => void
}

export const useStore = create<AppState>((set) => ({
  page: 'home',
  adminTab: 'dashboard',
  selectedCategoryId: null,
  selectedProductId: null,
  navigate: (page, categoryId = null, productId = null) => {
    set({ page, selectedCategoryId: categoryId, selectedProductId: productId })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  setAdminTab: (tab) => {
    set({ adminTab: tab })
  },
}))
