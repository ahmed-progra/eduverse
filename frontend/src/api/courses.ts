import axiosInstance from './axiosInstance'
import type { LearningPath, Course } from '../types'

export async function getPaths(): Promise<LearningPath[]> {
  const { data } = await axiosInstance.get<LearningPath[]>('/paths')
  return data
}

export async function getCourses(pathSlug?: string): Promise<Course[]> {
  const params = pathSlug ? { path_slug: pathSlug } : {}
  const { data } = await axiosInstance.get<Course[]>('/courses', { params })
  return data
}

export async function getCourse(slug: string): Promise<Course> {
  const { data } = await axiosInstance.get<Course>(`/courses/${slug}`)
  return data
}
