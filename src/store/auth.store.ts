import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  token: string | null
  user: AuthUser | null
  tenantId: string | null
  isAuthenticated: boolean
  setAuth: (token: string, user: AuthUser) => void
  setTenantId: (tenantId: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      tenantId: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      setTenantId: (tenantId) => set({ tenantId }),
      clearAuth: () => set({ token: null, user: null, tenantId: null, isAuthenticated: false }),
    }),
    {
      name: 'tradieone-auth',
      partialize: (state) => ({ token: state.token, user: state.user, tenantId: state.tenantId }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) state.isAuthenticated = true
      },
    },
  ),
)
