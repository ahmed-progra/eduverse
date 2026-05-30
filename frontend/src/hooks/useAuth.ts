import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const loginAction = useAuthStore((s) => s.loginAction)
  const signupAction = useAuthStore((s) => s.signupAction)
  const logoutAction = useAuthStore((s) => s.logoutAction)

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    loginAction,
    signupAction,
    logoutAction,
  }
}
