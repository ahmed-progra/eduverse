import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Zap, TrendingUp, Flame, Trophy } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageSpinner } from '../components/ui/Spinner'
import { ProgressBar } from '../components/ui/ProgressBar'
import { useAuthStore } from '../stores/authStore'
import { useTitle } from '../hooks/useTitle'

export default function Dashboard() {
  useTitle('Dashboard')
  const user = useAuthStore((s) => s.user)

  if (!user) return <PageSpinner />

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-primary" />
            <span className="font-display text-xl font-bold gradient-text">EduVerse</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 text-accent-primary">
                <Zap className="w-4 h-4" />
                <span className="font-medium">{user.xp} XP</span>
              </div>
              <div className="flex items-center gap-1 text-accent-success">
                <Flame className="w-4 h-4" />
                <span className="font-medium">{user.streak} day streak</span>
              </div>
            </div>
            <Link to="/">
              <Button variant="secondary" className="text-sm">Logout</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-text-primary">
            Welcome back, {user.username}
          </h1>
          <p className="text-text-secondary mt-1">Continue where you left off</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-accent-primary" />
              <h3 className="font-medium text-text-primary">Level {user.level}</h3>
            </div>
            <ProgressBar value={user.xp % 100} max={100} size="sm" />
            <p className="text-xs text-text-muted mt-2">{user.xp} total XP</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Flame className="w-5 h-5 text-accent-danger" />
              <h3 className="font-medium text-text-primary">Streak</h3>
            </div>
            <p className="text-2xl font-display font-bold text-text-primary">{user.streak} days</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-5 h-5 text-accent-secondary" />
              <h3 className="font-medium text-text-primary">Rank</h3>
            </div>
            <p className="text-2xl font-display font-bold text-text-primary">#—</p>
          </Card>
        </div>

        <div className="flex gap-4">
          <Link to="/paths">
            <Button variant="primary">
              <BookOpen className="w-4 h-4" />
              Browse Learning Paths
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
