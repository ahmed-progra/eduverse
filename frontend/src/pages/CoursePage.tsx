import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, FileText } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
import { getCourse } from '../api/courses'
import type { Course } from '../types'
import { useTitle } from '../hooks/useTitle'

export default function CoursePage() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  useTitle(courseSlug ? `${courseSlug.replace(/-/g, ' ')}` : 'Course')
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!courseSlug) return
    getCourse(courseSlug)
      .then(setCourse)
      .finally(() => setIsLoading(false))
  }, [courseSlug])

  if (isLoading) return <div className="p-6"><CardSkeleton /></div>
  if (!course) return <p className="text-text-muted text-center py-20">Course not found.</p>

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-primary" />
            <span className="font-display text-xl font-bold gradient-text">EduVerse</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link to={course.path_id ? `/paths/${course.path_id}` : '/paths'} className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={course.difficulty as 'beginner' | 'intermediate' | 'advanced'}>
              {course.difficulty}
            </Badge>
            <span className="text-xs text-text-muted">{course.xp_reward} XP total</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-text-primary">{course.title}</h1>
          <p className="text-text-secondary mt-2">{course.description}</p>
          <div className="mt-6">
            <ProgressBar value={course.completed_lessons} max={course.lesson_count} />
          </div>
          <p className="text-text-muted text-sm mt-2">{course.completed_lessons} of {course.lesson_count} lessons completed</p>
        </motion.div>

        <div className="mt-8 space-y-3">
          {Array.from({ length: course.lesson_count }).map((_, i) => (
            <Link key={i} to={`/lessons/lesson_${course.id}_${i + 1}`}>
              <Card className="flex items-center gap-4 py-4 px-5 hover:border-accent-primary/40 transition-all cursor-pointer">
                {i < course.completed_lessons ? (
                  <CheckCircle className="w-5 h-5 text-accent-success shrink-0" />
                ) : (
                  <FileText className="w-5 h-5 text-text-muted shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    Lesson {i + 1}
                  </p>
                  <p className="text-xs text-text-muted">{i < course.completed_lessons ? 'Completed' : 'Not started'}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted shrink-0" />
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
