export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  xp: number
  level: number
  streak: number
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LearningPath {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  color: string
  course_count: number
  total_lessons: number
  completed_lessons: number
  level: string
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url?: string
  path_id?: string
  path_title?: string
  path_slug?: string
  lesson_count: number
  completed_lessons: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  xp_reward: number
  exam_id?: string
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  slug?: string
  order_index?: number
  blocks?: LessonBlock[]
  content?: LessonBlock[]
  xp_reward?: number
  is_completed?: boolean
}

export interface LessonBlock {
  id: string
  type: 'heading' | 'text' | 'code' | 'image' | 'callout' | 'quiz_prompt'
  content: string
  language?: string
  alt?: string
  url?: string
  variant?: 'info' | 'warning' | 'tip' | 'danger'
  quiz_id?: string
}

export interface Exam {
  id: string
  title: string
  description: string
  course_id: string
  time_limit_minutes: number
  passing_score: number
  xp_reward: number
  questions: Question[]
}

export interface Question {
  id: string
  text: string
  type: 'multiple_choice' | 'code' | 'short_answer'
  options?: string[]
  correct_option?: number
  code_template?: string
  code_language?: string
  points: number
}

export interface ExamAttempt {
  id: string
  exam_id: string
  user_id: string
  started_at: string
  completed_at?: string
  score?: number
  total_points: number
  status: 'in_progress' | 'completed' | 'expired'
}

export interface ExamResult {
  attempt_id: string
  exam_title: string
  score: number
  total_points: number
  percentage: number
  passed: boolean
  xp_earned: number
  answers?: {
    question_id: string
    question_text: string
    selected_option?: number
    code_answer?: string
    short_answer?: string
    correct: boolean
    points: number
    max_points: number
  }[]
  completed_at: string
}

export interface Progress {
  course_id: string
  completed_lessons: string[]
  percentage: number
  xp_earned: number
}

export interface DashboardData {
  user?: User
  in_progress_courses: Course[]
  recent_lessons: Lesson[]
  achievements: Achievement[]
  xp_today: number
  xp_this_week: number
  streak: number
  rank: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked_at?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}
