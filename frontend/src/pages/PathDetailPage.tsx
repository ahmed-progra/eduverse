import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, Code, Calculator, Atom } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
import { FadeIn, StaggerChildren, StaggerItem, GlowCard } from '../components/ui/TextAnimation'
import { getCourses } from '../api/courses'
import { getApiError } from '../utils/error'
import { toast } from 'react-hot-toast'
import type { Course } from '../types'
import { useTitle } from '../hooks/useTitle'

export default function PathDetailPage() {
  const { pathSlug } = useParams<{ pathSlug: string }>()
  useTitle(pathSlug ? `${pathSlug.replace(/-/g, ' ')}` : 'Path')
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!pathSlug) return
    getCourses(pathSlug)
      .then(setCourses)
      .catch((err) => toast.error(getApiError(err, 'Failed to load courses')))
      .finally(() => setIsLoading(false))
  }, [pathSlug])

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-primary" />
            <span className="font-display text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              EduVerse
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/paths" className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to paths
        </Link>

        <FadeIn>
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary capitalize">
              {pathSlug?.replace(/-/g, ' ')}
            </h1>
            <p className="text-text-secondary mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} available</p>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-text-muted text-center py-20">No courses in this path yet.</p>
        ) : (
          <StaggerChildren staggerDelay={0.12} className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <StaggerItem key={course.id}>
                <Link to={`/courses/${course.slug}`} className="block group">
                  <GlowCard>
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={course.difficulty as 'beginner' | 'intermediate' | 'advanced'}>
                        {course.difficulty}
                      </Badge>
                      <motion.span
                        className="text-xs text-accent-primary font-mono font-bold"
                        whileHover={{ scale: 1.1 }}
                      >
                        {course.xp_reward} XP
                      </motion.span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 line-clamp-2">{course.description}</p>
                    <div className="mt-4">
                      <ProgressBar value={course.completed_lessons} max={course.lesson_count} size="sm" />
                    </div>
                    <div className="flex items-center justify-between mt-4 text-sm">
                      <span className="text-text-muted">{course.completed_lessons}/{course.lesson_count} lessons</span>
                      <motion.span
                        className="text-accent-primary font-medium inline-flex items-center gap-1"
                        whileHover={{ gap: '0.5rem' }}
                      >
                        Start <ArrowRight className="w-3 h-3" />
                      </motion.span>
                    </div>
                  </GlowCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </main>
    </div>
  )
}
