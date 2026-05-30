import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, MessageCircle, Zap } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LessonSkeleton } from '../components/ui/Skeleton'
import { FadeIn, StaggerChildren, StaggerItem } from '../components/ui/TextAnimation'
import { getLesson } from '../api/lessons'
import { useProgressStore } from '../stores/progressStore'
import { useChatStore } from '../stores/chatStore'
import { useTitle } from '../hooks/useTitle'
import { getApiError } from '../utils/error'
import { toast } from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import type { Lesson } from '../types'

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  useTitle('Lesson')
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleting, setIsCompleting] = useState(false)
  const markComplete = useProgressStore((s) => s.markComplete)
  const setLessonContext = useChatStore((s) => s.setLesson)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    if (!lessonId) return
    getLesson(lessonId)
      .then((l) => {
        setLesson(l)
        setLessonContext(l.id)
      })
      .catch((err) => toast.error(getApiError(err, 'Failed to load lesson')))
      .finally(() => setIsLoading(false))
  }, [lessonId, setLessonContext])

  const handleComplete = async () => {
    if (!lessonId) return
    setIsCompleting(true)
    try {
      await markComplete(lessonId)
      toast.success('Lesson completed!')
    } catch (err: any) {
      toast.error(getApiError(err, 'Failed to complete lesson'))
    } finally {
      setIsCompleting(false)
    }
  }

  if (isLoading) return <div className="max-w-3xl mx-auto px-6 py-8"><LessonSkeleton /></div>
  if (!lesson) return <p className="text-text-muted text-center py-20">Lesson not found.</p>

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-primary" />
            <span className="font-display text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              EduVerse
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link to={`/courses/${lesson.course_id}`} className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to course
        </Link>

        <FadeIn>
          <div className="mb-6">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary">{lesson.title}</h1>
            <span className="text-xs text-accent-primary font-medium inline-flex items-center gap-1 mt-1">
              <Zap className="w-3 h-3" /> {lesson.xp_reward || 20} XP
            </span>
          </div>
        </FadeIn>

        <StaggerChildren staggerDelay={0.06} className="mt-6 space-y-6">
          {(lesson.blocks || lesson.content || []).map((block: any) => (
            <StaggerItem key={block.id}>
              {block.type === 'heading' && (
                <h2 className="font-display text-xl font-semibold text-text-primary">
                  {block.content}
                </h2>
              )}
              {block.type === 'text' && (
                <motion.div
                  className="prose prose-invert max-w-none text-text-secondary leading-relaxed"
                  whileHover={{ x: 2 }}
                >
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{block.content}</ReactMarkdown>
                </motion.div>
              )}
              {block.type === 'code' && (
                <motion.div whileHover={{ scale: 1.01 }}>
                  <Card className="bg-bg-surface p-0 overflow-hidden border-accent-primary/10">
                    {block.language && (
                      <div className="px-4 py-2 bg-bg-border/50 border-b border-bg-border text-xs text-text-muted font-mono flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent-success" />
                        {block.language}
                      </div>
                    )}
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-sm font-mono text-text-primary">{block.content}</code>
                    </pre>
                  </Card>
                </motion.div>
              )}
              {block.type === 'callout' && (
                <motion.div
                  whileHover={{ x: 3 }}
                  className={`p-4 rounded-xl border-l-4 ${
                    block.variant === 'warning' ? 'border-accent-danger bg-accent-danger/5' :
                    block.variant === 'tip' ? 'border-accent-success bg-accent-success/5' :
                    block.variant === 'danger' ? 'border-accent-danger bg-accent-danger/5' :
                    'border-accent-secondary bg-accent-secondary/5'
                  }`}
                >
                  <p className="text-sm text-text-primary leading-relaxed">
                    <span className="font-semibold uppercase text-xs tracking-wider block mb-1 opacity-60">
                      {block.variant || 'info'}
                    </span>
                    {block.content}
                  </p>
                </motion.div>
              )}
              {block.type === 'image' && block.url && (
                <motion.img
                  src={block.url}
                  alt={block.alt || ''}
                  className="rounded-xl max-w-full"
                  whileHover={{ scale: 1.02 }}
                />
              )}
              {block.type === 'quiz_prompt' && (
                <Card className="border-accent-primary/30">
                  <p className="text-sm text-text-primary mb-3">{block.content}</p>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="primary" size="sm" onClick={() => { if (block.quiz_id) navigate(`/exams/${block.quiz_id}`) }}>
                      Take Quiz <ChevronRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Card>
              )}
            </StaggerItem>
          ))}
        </StaggerChildren>

        <div className="mt-10 flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="success"
              onClick={handleComplete}
              isLoading={isCompleting}
              disabled={lesson.is_completed}
            >
              <CheckCircle className="w-4 h-4" />
              {lesson.is_completed ? 'Completed' : 'Mark as Complete'}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="secondary" onClick={() => setShowChat(!showChat)}>
              <MessageCircle className="w-4 h-4" />
              AI Tutor
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
