import axiosInstance from './axiosInstance'
import type { ChatMessage } from '../types'

export async function sendMessage(
  message: string,
  lessonId?: string,
): Promise<{ reply: string }> {
  const { data } = await axiosInstance.post<{ reply: string }>('/ai/chat', {
    message,
    lesson_id: lessonId,
  })
  return data
}

export async function summarizeLesson(lessonId: string): Promise<{ summary: string; key_points: string[] }> {
  const { data } = await axiosInstance.post<{ summary: string; key_points: string[] }>(
    `/ai/summarize/${lessonId}`,
  )
  return data
}
