import axiosInstance from './axiosInstance'
import type { User } from '../types'

interface BackendAuthResponse {
  access_token: string
  token_type: string
  user: User
}

interface AuthResponse {
  user: User
  token: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<BackendAuthResponse>('/auth/login', { email, password })
  return { user: data.user, token: data.access_token }
}

export async function signup(username: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<BackendAuthResponse>('/auth/signup', {
    username,
    email,
    password,
    full_name: username,
  })
  return { user: data.user, token: data.access_token }
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout')
}

export async function getMe(): Promise<User> {
  const { data } = await axiosInstance.get<User>('/auth/me')
  return data
}
