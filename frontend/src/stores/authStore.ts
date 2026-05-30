import { create } from 'zustand'
import type { User } from '../types'
import { setToken, removeToken, getToken } from '../utils/tokenStorage'
import * as authApi from '../api/auth'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  loginAction: (email: string, password: string) => Promise<void>
  signupAction: (username: string, email: string, password: string) => Promise<void>
  logoutAction: () => Promise<void>
  initAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: getToken(),
  isAuthenticated: false,
  isLoading: true,

  loginAction: async (email: string, password: string) => {
    const res = await authApi.login(email, password)
    setToken(res.token)
    set({
      user: res.user,
      token: res.token,
      isAuthenticated: true,
    })
  },

  signupAction: async (username: string, email: string, password: string) => {
    const res = await authApi.signup(username, email, password)
    setToken(res.token)
    set({
      user: res.user,
      token: res.token,
      isAuthenticated: true,
    })
  },

  logoutAction: async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    }
    removeToken()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  initAuth: async () => {
    const token = getToken()
    if (!token) {
      set({ isLoading: false })
      return
    }
    try {
      const user = await authApi.getMe()
      set({ user, token, isAuthenticated: true, isLoading: false })
    } catch {
      removeToken()
      set({ user: null, token: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
