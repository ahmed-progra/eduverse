import axiosInstance from './axiosInstance'
import type { Exam, ExamResult, ExamAttempt } from '../types'

export async function getExam(examId: string): Promise<Exam> {
  const { data } = await axiosInstance.get<Exam>(`/exams/${examId}`)
  return data
}

export async function submitExam(
  examId: string,
  answers: { question_id: string; selected_option?: number; code_answer?: string; short_answer?: string }[],
): Promise<ExamResult> {
  const { data } = await axiosInstance.post<ExamResult>(`/exams/${examId}/submit`, { answers })
  return data
}

export async function getAttempts(): Promise<ExamAttempt[]> {
  const { data } = await axiosInstance.get<ExamAttempt[]>('/exams/attempts')
  return data
}
