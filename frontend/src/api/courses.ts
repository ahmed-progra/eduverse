import axiosInstance from './axiosInstance'
import type { LearningPath, Course } from '../types'

export async function getPaths(): Promise<LearningPath[]> {
  const { data } = await axiosInstance.get<LearningPath[]>('/paths')
  return data
}

export async function getCourses(pathSlug?: string): Promise<Course[]> {
  if (pathSlug) {
    const { data } = await axiosInstance.get<Course[]>(`/paths/${pathSlug}/courses`)
    return data
  }
  const { data } = await axiosInstance.get<Course[]>('/paths')
  return []
}

export async function getCourse(slug: string): Promise<any> {
  const { data } = await axiosInstance.get<any>(`/courses/${slug}`)
  return data
}
