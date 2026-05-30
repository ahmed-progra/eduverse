import { create } from 'zustand'
import type { DashboardData } from '../types'
import * as lessonsApi from '../api/lessons'
import * as coursesApi from '../api/courses'

interface ProgressStore {
  dashboard: DashboardData | null
  completedLessons: Set<string>
  isLoading: boolean
  fetchDashboard: () => Promise<void>
  markComplete: (lessonId: string) => Promise<number>
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  dashboard: null,
  completedLessons: new Set<string>(),
  isLoading: false,

  fetchDashboard: async () => {
    set({ isLoading: true })
    try {
      const [paths, courses] = await Promise.all([
        coursesApi.getPaths(),
        coursesApi.getCourses(),
      ])
      set({
        dashboard: {
          in_progress_courses: courses,
          recent_lessons: [],
          achievements: [],
          xp_today: 0,
          xp_this_week: 0,
          streak: 0,
          rank: 0,
        },
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
    }
  },

  markComplete: async (lessonId: string) => {
    const res = await lessonsApi.completeLesson(lessonId)
    const current = new Set(get().completedLessons)
    current.add(lessonId)
    set({ completedLessons: current })
    return res.xp_earned || 0
  },
}))
