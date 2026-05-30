import axiosInstance from './axiosInstance'
import type { Lesson } from '../types'

export async function getLesson(lessonId: string): Promise<Lesson> {
  const { data } = await axiosInstance.get<Lesson>(`/lessons/${lessonId}`)
  return data
}

export async function completeLesson(lessonId: string): Promise<{ xp_earned: number }> {
  const { data } = await axiosInstance.post<{ xp_earned: number }>(`/lessons/${lessonId}/complete`)
  return data
}
