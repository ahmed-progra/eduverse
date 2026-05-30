import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ArrowLeft, ArrowRight, CheckCircle, Zap } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageSpinner } from '../components/ui/Spinner'
import { FadeIn, StaggerChildren, StaggerItem } from '../components/ui/TextAnimation'
import { getExam, submitExam } from '../api/exams'
import { getApiError } from '../utils/error'
import type { Exam, Question } from '../types'
import { useTitle } from '../hooks/useTitle'
import { toast } from 'react-hot-toast'

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  useTitle('Exam')
  const [exam, setExam] = useState<Exam | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, number | string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (!examId) return
    getExam(examId)
      .then((e) => {
        setExam(e)
        setTimeLeft(e.time_limit_minutes * 60)
      })
      .catch((err) => toast.error(getApiError(err, 'Failed to load exam')))
      .finally(() => setIsLoading(false))
  }, [examId])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null || t <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timeLeft === null])

  const handleSelect = (questionId: string, value: number | string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    if (!exam || !examId) return
    setIsSubmitting(true)
    try {
      const formatted = exam.questions.map((q) => ({
        question_id: q.id,
        selected_option: q.type === 'multiple_choice' ? (answers[q.id] as number) : undefined,
        code_answer: q.type === 'code' ? (answers[q.id] as string) : undefined,
        short_answer: q.type === 'short_answer' ? (answers[q.id] as string) : undefined,
      }))
      const result = await submitExam(examId, formatted)
      navigate(`/results/${result.attempt_id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit exam')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (isLoading) return <PageSpinner />
  if (!exam) return <p className="text-text-muted text-center py-20">Exam not found.</p>

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
          {timeLeft !== null && (
            <motion.div
              className={`flex items-center gap-2 text-sm font-mono ${timeLeft < 60 ? 'text-accent-danger' : 'text-text-secondary'}`}
              animate={timeLeft < 60 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </motion.div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <FadeIn>
          <div className="mb-6">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">{exam.title}</h1>
            <p className="text-text-secondary mt-1">{exam.description}</p>
            <p className="text-text-muted text-sm mt-1 flex items-center gap-1">
              Passing score: {exam.passing_score}%
              {exam.xp_reward && (
                <><span className="mx-1">&bull;</span><Zap className="w-3 h-3 text-accent-primary" /> {exam.xp_reward} XP</>
              )}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren staggerDelay={0.06} className="mt-6 space-y-4">
          {exam.questions.map((q, i) => (
            <StaggerItem key={q.id}>
              <motion.div whileHover={{ x: 2 }}>
                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-medium text-text-primary">
                      {i + 1}. {q.text}
                    </h3>
                    <span className="text-xs text-text-muted shrink-0 ml-2 px-2 py-0.5 rounded bg-bg-border/50">{q.points} pts</span>
                  </div>
                  {q.type === 'multiple_choice' && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <label
                          key={oi}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            answers[q.id] === oi
                              ? 'border-accent-primary bg-accent-primary/5 shadow-sm shadow-accent-primary/10'
                              : 'border-bg-border hover:border-text-muted hover:bg-bg-surface'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={answers[q.id] === oi}
                            onChange={() => handleSelect(q.id, oi)}
                            className="accent-accent-primary"
                          />
                          <span className="text-sm text-text-primary">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'code' && (
                    <textarea
                      value={(answers[q.id] as string) || ''}
                      onChange={(e) => handleSelect(q.id, e.target.value)}
                      placeholder="Write your code here..."
                      className="w-full h-32 px-4 py-3 rounded-xl bg-bg-surface border border-bg-border text-text-primary font-mono text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 resize-y transition-all"
                      spellCheck={false}
                    />
                  )}
                  {q.type === 'short_answer' && (
                    <textarea
                      value={(answers[q.id] as string) || ''}
                      onChange={(e) => handleSelect(q.id, e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full px-4 py-3 rounded-xl bg-bg-surface border border-bg-border text-text-primary text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20 resize-none transition-all"
                      rows={3}
                    />
                  )}
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <div className="mt-8 flex items-center justify-between">
          <motion.span
            className="text-sm text-text-muted"
            animate={{ scale: Object.keys(answers).length === exam.questions.length ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {Object.keys(answers).length} of {exam.questions.length} answered
          </motion.span>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="success"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={Object.keys(answers).length < exam.questions.length}
            >
              <CheckCircle className="w-4 h-4" />
              Submit Exam
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
