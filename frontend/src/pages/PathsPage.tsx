import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { CardSkeleton } from '../components/ui/Skeleton'
import { getPaths } from '../api/courses'
import { getApiError } from '../utils/error'
import { toast } from 'react-hot-toast'
import type { LearningPath } from '../types'
import { useTitle } from '../hooks/useTitle'

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
        setError(msg)
        toast.error(msg)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-primary" />
            <span className="font-display text-xl font-bold gradient-text">EduVerse</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-text-primary">Learning Paths</h1>
          <p className="text-text-secondary mt-1">Choose a path and start mastering new skills</p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <p className="text-accent-danger text-center py-20">{error}</p>
        ) : paths.length === 0 ? (
          <p className="text-text-muted text-center py-20">No learning paths available yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paths.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/paths/${path.slug}`} className="block group">
                  <Card className="h-full hover:border-accent-primary/40 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl">{path.icon}</span>
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
                      <span className="text-accent-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        Continue <ArrowRight className="w-3 h-3" />
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
