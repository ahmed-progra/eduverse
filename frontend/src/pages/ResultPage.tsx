import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle, XCircle, Trophy, Home, Zap, RotateCcw } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageSpinner } from '../components/ui/Spinner'
import { FadeIn, StaggerChildren, StaggerItem, AnimatedCounter } from '../components/ui/TextAnimation'
import { useTitle } from '../hooks/useTitle'
import axiosInstance from '../api/axiosInstance'
import { getApiError } from '../utils/error'
import { toast } from 'react-hot-toast'
import type { ExamResult } from '../types'
import confetti from 'canvas-confetti'

export default function ResultPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  useTitle('Results')
  const [result, setResult] = useState<ExamResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!attemptId) return
    axiosInstance.get<ExamResult>(`/exams/results/${attemptId}`)
      .then(({ data }) => {
        setResult(data)
        if (data.passed) {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } })
        }
      })
      .catch((err) => toast.error(getApiError(err, 'Failed to load results')))
      .finally(() => setIsLoading(false))
  }, [attemptId])

  if (isLoading) return <PageSpinner />
  if (!result) return <p className="text-text-muted text-center py-20">Result not found.</p>

  const answers = result.answers || []

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-accent-primary" />
          <span className="font-display text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            EduVerse
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <FadeIn>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {result.passed ? (
                <Trophy className="w-20 h-20 text-accent-success mx-auto mb-4" />
              ) : (
                <XCircle className="w-20 h-20 text-accent-danger mx-auto mb-4" />
              )}
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
              {result.passed ? 'Congratulations!' : 'Not quite'}
            </h1>
            <p className="text-text-secondary mt-1">{result.exam_title}</p>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card className="mb-8 border-accent-primary/10">
            <div className="grid grid-cols-3 gap-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-accent-primary">
                  <AnimatedCounter value={result.percentage} />%
                </p>
                <p className="text-xs text-text-muted mt-1">Score</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-3xl md:text-4xl font-display font-bold text-accent-success inline-flex items-center justify-center gap-1">
                  +<AnimatedCounter value={result.xp_earned} />
                </p>
                <p className="text-xs text-text-muted mt-1">XP Earned</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className={`text-3xl md:text-4xl font-display font-bold ${result.passed ? 'text-accent-success' : 'text-accent-danger'}`}>
                  {result.passed ? 'Pass' : 'Fail'}
                </p>
                <p className="text-xs text-text-muted mt-1">Result</p>
              </motion.div>
            </div>
          </Card>
        </FadeIn>

        <StaggerChildren staggerDelay={0.05} className="space-y-3">
          {answers.map((ans) => (
            <StaggerItem key={ans.question_id}>
              <motion.div whileHover={{ x: 2 }}>
                <Card className={`py-3 px-5 ${ans.correct ? 'border-accent-success/20' : 'border-accent-danger/20'}`}>
                  <div className="flex items-start gap-3">
                    {ans.correct ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <CheckCircle className="w-5 h-5 text-accent-success shrink-0 mt-0.5" />
                      </motion.div>
                    ) : (
                      <XCircle className="w-5 h-5 text-accent-danger shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{ans.question_text}</p>
                      <p className="text-xs text-text-muted mt-1">
                        {ans.correct ? (
                          <span className="text-accent-success font-medium">Correct (+{ans.points} pts)</span>
                        ) : (
                          <span className="text-accent-danger">Incorrect ({ans.points}/{ans.max_points} pts)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/dashboard">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="primary">
                <Home className="w-4 h-4" /> Dashboard
              </Button>
            </motion.div>
          </Link>
        </div>
      </main>
    </div>
  )
}
