import axiosInstance from './axiosInstance'
import type { User } from '../types'

interface AuthResponse {
  user: User
  token: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export async function signup(username: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/signup', { username, email, password })
  return data
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout')
}

export async function getMe(): Promise<User> {
  const { data } = await axiosInstance.get<User>('/auth/me')
  return data
}
