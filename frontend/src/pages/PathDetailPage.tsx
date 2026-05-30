import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
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
      <header className="border-b border-bg-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-primary" />
            <span className="font-display text-xl font-bold gradient-text">EduVerse</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Link to="/paths" className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to paths
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-text-primary capitalize">{pathSlug?.replace(/-/g, ' ')}</h1>
          <p className="text-text-secondary mt-1">{courses.length} courses available</p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-text-muted text-center py-20">No courses in this path yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/courses/${course.slug}`} className="block group">
                  <Card className="h-full hover:border-accent-primary/40 transition-all duration-300">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant={course.difficulty as 'beginner' | 'intermediate' | 'advanced'}>
                        {course.difficulty}
                      </Badge>
                      <span className="text-xs text-text-muted">{course.xp_reward} XP</span>
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
                      <span className="text-accent-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Start <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
