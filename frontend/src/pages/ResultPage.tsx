import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, CheckCircle, XCircle, Trophy, Home, RotateCcw } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageSpinner } from '../components/ui/Spinner'
import { useTitle } from '../hooks/useTitle'
import axiosInstance from '../api/axiosInstance'
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
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
        }
      })
      .finally(() => setIsLoading(false))
  }, [attemptId])

  if (isLoading) return <PageSpinner />
  if (!result) return <p className="text-text-muted text-center py-20">Result not found.</p>

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-accent-primary" />
          <span className="font-display text-xl font-bold gradient-text">EduVerse</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          {result.passed ? (
            <Trophy className="w-16 h-16 text-accent-success mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-accent-danger mx-auto mb-4" />
          )}
          <h1 className="font-display text-3xl font-bold text-text-primary">
            {result.passed ? 'Congratulations!' : 'Not quite'}
          </h1>
          <p className="text-text-secondary mt-1">{result.exam_title}</p>
        </motion.div>

        <Card className="mb-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-display font-bold text-accent-primary">{result.percentage}%</p>
              <p className="text-xs text-text-muted mt-1">Score</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-accent-success">+{result.xp_earned}</p>
              <p className="text-xs text-text-muted mt-1">XP Earned</p>
            </div>
            <div>
              <p className={`text-3xl font-display font-bold ${result.passed ? 'text-accent-success' : 'text-accent-danger'}`}>
                {result.passed ? 'Pass' : 'Fail'}
              </p>
              <p className="text-xs text-text-muted mt-1">Result</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {result.answers.map((ans, i) => (
            <motion.div
              key={ans.question_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`py-3 px-5 ${ans.correct ? 'border-accent-success/20' : 'border-accent-danger/20'}`}>
                <div className="flex items-start gap-3">
                  {ans.correct ? (
                    <CheckCircle className="w-5 h-5 text-accent-success shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-accent-danger shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">{ans.question_text}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {ans.correct ? (
                        <span className="text-accent-success">Correct (+{ans.points} pts)</span>
                      ) : (
                        <span className="text-accent-danger">Incorrect ({ans.points}/{ans.max_points} pts)</span>
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/dashboard">
            <Button variant="secondary">
              <Home className="w-4 h-4" /> Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
