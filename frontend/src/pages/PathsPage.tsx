import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Code, Calculator, Atom } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
import { FadeIn, StaggerChildren, StaggerItem, GlowCard } from '../components/ui/TextAnimation'
import { getPaths } from '../api/courses'
import { getApiError } from '../utils/error'
import { toast } from 'react-hot-toast'
import type { LearningPath } from '../types'
import { useTitle } from '../hooks/useTitle'

const pathIcons: Record<string, typeof Code> = { code: Code, calculator: Calculator, atom: Atom }

export default function PathsPage() {
  useTitle('Learning Paths')
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPaths()
      .then(setPaths)
      .catch((err) => {
        const msg = getApiError(err, 'Failed to load paths')
        setError(msg); toast.error(msg)
      })
      .finally(() => setIsLoading(false))
  }, [])

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
        <FadeIn>
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">Learning Paths</h1>
            <p className="text-text-secondary mt-1">Choose a path and start mastering new skills</p>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <p className="text-accent-danger text-center py-20">{error}</p>
        ) : paths.length === 0 ? (
          <p className="text-text-muted text-center py-20">No learning paths available yet.</p>
        ) : (
          <StaggerChildren staggerDelay={0.12} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path) => {
              const Icon = pathIcons[path.icon] || BookOpen
              return (
                <StaggerItem key={path.id}>
                  <Link to={`/paths/${path.slug}`} className="block group">
                    <GlowCard>
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${path.color}15` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: path.color }} />
                        </motion.div>
                        <Badge variant={
                          path.level === 'beginner' ? 'beginner' :
                          path.level === 'intermediate' ? 'intermediate' : 'advanced'
                        }>
                          {path.level}
                        </Badge>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                        {path.title}
                      </h3>
                      <p className="text-sm text-text-secondary mt-2 line-clamp-2">{path.description}</p>
                      <div className="mt-4">
                        <ProgressBar value={path.completed_lessons} max={path.total_lessons} size="sm" />
                      </div>
                      <div className="flex items-center justify-between mt-4 text-sm">
                        <span className="text-text-muted">{path.course_count} courses</span>
                        <motion.span
                          className="text-accent-primary font-medium inline-flex items-center gap-1"
                          whileHover={{ gap: '0.5rem' }}
                        >
                          Continue <ArrowRight className="w-3 h-3" />
                        </motion.span>
                      </div>
                    </GlowCard>
                  </Link>
                </StaggerItem>
              )
            })}
          </StaggerChildren>
        )}
      </main>
    </div>
  )
}
