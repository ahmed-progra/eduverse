import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, FileText, Zap } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
import { FadeIn, StaggerChildren, StaggerItem, GlowCard } from '../components/ui/TextAnimation'
import { getCourse } from '../api/courses'
import { useTitle } from '../hooks/useTitle'

export default function CoursePage() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  useTitle(courseSlug ? `${courseSlug.replace(/-/g, ' ')}` : 'Course')
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!courseSlug) return
    getCourse(courseSlug)
      .then((data: any) => setCourse(data))
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [courseSlug])

  if (isLoading) return <div className="p-6"><CardSkeleton /></div>
  if (!course) return <p className="text-text-muted text-center py-20">Course not found.</p>

  const lessons: any[] = course.lessons || []
  const completedLessons = course.completed_lessons || 0
  const totalLessons = lessons.length || course.total_lessons || 0

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-primary" />
            <span className="font-display text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              EduVerse
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link to="/paths" className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to paths
        </Link>

        <FadeIn>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant={course.difficulty as 'beginner' | 'intermediate' | 'advanced'}>
                {course.difficulty}
              </Badge>
              <span className="text-xs text-text-muted">{course.estimated_hours || '?'} hours</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">{course.title}</h1>
            <p className="text-text-secondary mt-2">{course.description}</p>
            <div className="mt-6">
              <ProgressBar value={completedLessons} max={totalLessons || 1} size="md" />
            </div>
            <p className="text-text-muted text-sm mt-2">{completedLessons} of {totalLessons} lessons completed</p>
          </div>
        </FadeIn>

        <StaggerChildren staggerDelay={0.08} className="mt-8 space-y-3">
          {lessons.map((lesson: any, i: number) => (
            <StaggerItem key={lesson.id}>
              <Link to={`/lessons/${lesson.id}`}>
                <motion.div
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="block"
                >
                  <Card className="flex items-center gap-4 py-4 px-5 hover:border-accent-primary/40 transition-all cursor-pointer">
                    {i < completedLessons ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <CheckCircle className="w-5 h-5 text-accent-success shrink-0" />
                      </motion.div>
                    ) : (
                      <FileText className="w-5 h-5 text-text-muted shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                        <span>{i < completedLessons ? 'Completed' : 'Not started'}</span>
                        {lesson.xp_reward && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-accent-primary">
                              <Zap className="w-3 h-3" /> {lesson.xp_reward} XP
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted shrink-0" />
                  </Card>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </main>
    </div>
  )
}
