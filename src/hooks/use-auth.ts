import { useAuthStore } from '@/store/auth.store'

export function useAuth() {
  const { token, user, isAuthenticated, setAuth, clearAuth } = useAuthStore()
  return { token, user, isAuthenticated, setAuth, clearAuth }
}
