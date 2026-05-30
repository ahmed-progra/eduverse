import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, MessageCircle } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { LessonSkeleton } from '../components/ui/Skeleton'
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
      <header className="border-b border-bg-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-primary" />
            <span className="font-display text-xl font-bold gradient-text">EduVerse</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Link to={`/courses/${lesson.course_id}`} className="inline-flex items-center gap-2 text-text-muted hover:text-text-secondary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to course
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-text-primary">{lesson.title}</h1>
          <span className="text-xs text-text-muted">{lesson.xp_reward} XP</span>
        </motion.div>

        <div className="mt-8 space-y-6">
          {lesson.blocks.map((block) => (
            <div key={block.id}>
              {block.type === 'heading' && (
                <h2 className="font-display text-xl font-semibold text-text-primary">{block.content}</h2>
              )}
              {block.type === 'text' && (
                <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{block.content}</ReactMarkdown>
                </div>
              )}
              {block.type === 'code' && (
                <Card className="bg-bg-surface p-0 overflow-hidden">
                  {block.language && (
                    <div className="px-4 py-2 bg-bg-border/50 border-b border-bg-border text-xs text-text-muted font-mono">
                      {block.language}
                    </div>
                  )}
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-sm font-mono text-text-primary">{block.content}</code>
                  </pre>
                </Card>
              )}
              {block.type === 'callout' && (
                <div className={`p-4 rounded-xl border-l-4 ${
                  block.variant === 'warning' ? 'border-accent-danger bg-accent-danger/5' :
                  block.variant === 'tip' ? 'border-accent-success bg-accent-success/5' :
                  block.variant === 'danger' ? 'border-accent-danger bg-accent-danger/5' :
                  'border-accent-secondary bg-accent-secondary/5'
                }`}>
                  <p className="text-sm text-text-primary">{block.content}</p>
                </div>
              )}
              {block.type === 'image' && block.url && (
                <img src={block.url} alt={block.alt || ''} className="rounded-xl max-w-full" />
              )}
              {block.type === 'quiz_prompt' && (
                <Card className="border-accent-primary/30">
                  <p className="text-sm text-text-primary mb-3">{block.content}</p>
                  <Button variant="primary" size="sm" onClick={() => { if (block.quiz_id) navigate(`/exams/${block.quiz_id}`) }}>
                    Take Quiz <ChevronRight className="w-4 h-4" />
                  </Button>
                </Card>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-4">
          <Button
            variant="success"
            onClick={handleComplete}
            isLoading={isCompleting}
            disabled={lesson.is_completed}
          >
            <CheckCircle className="w-4 h-4" />
            {lesson.is_completed ? 'Completed' : 'Mark as Complete'}
          </Button>
          <Button variant="secondary" onClick={() => setShowChat(!showChat)}>
            <MessageCircle className="w-4 h-4" />
            AI Tutor
          </Button>
        </div>
      </main>
    </div>
  )
}
