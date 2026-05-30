import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { BookOpen, Zap, Flame, Trophy, TrendingUp, Code, LogOut } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PageSpinner } from '../components/ui/Spinner'
import { ProgressBar } from '../components/ui/ProgressBar'
import { FadeIn, StaggerChildren, StaggerItem, AnimatedCounter } from '../components/ui/TextAnimation'
import { useAuthStore } from '../stores/authStore'
import { useTitle } from '../hooks/useTitle'

export default function Dashboard() {
  useTitle('Dashboard')
  const user = useAuthStore((s) => s.user)
  const logoutAction = useAuthStore((s) => s.logoutAction)

  if (!user) return <PageSpinner />

  const stats = [
    { icon: Zap, label: 'Level', value: user.level, color: 'text-accent-primary', bg: 'bg-accent-primary/10', sub: `${user.xp} total XP` },
    { icon: Flame, label: 'Streak', value: `${user.streak} days`, color: 'text-accent-danger', bg: 'bg-accent-danger/10', sub: 'Keep going!' },
    { icon: Trophy, label: 'Rank', value: '#—', color: 'text-accent-secondary', bg: 'bg-accent-secondary/10', sub: 'Complete more lessons' },
  ]

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <motion.div
                className="flex items-center gap-1 text-accent-primary"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4" />
                <span className="font-medium">
                  <AnimatedCounter value={user.xp} /> XP
                </span>
              </motion.div>
              <div className="flex items-center gap-1 text-accent-success">
                <Flame className="w-4 h-4" />
                <span className="font-medium">{user.streak} day streak</span>
              </div>
            </div>
            <Button variant="secondary" className="text-sm" onClick={logoutAction}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <FadeIn>
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                {user.username}
              </span>
            </h1>
            <p className="text-text-secondary mt-1">Continue your learning journey</p>
          </div>
        </FadeIn>

        <StaggerChildren staggerDelay={0.1} className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map(({ icon: Icon, label, value, color, bg, sub }) => (
            <StaggerItem key={label}>
              <motion.div whileHover={{ y: -4, scale: 1.02 }}>
                <Card className="h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <h3 className="font-medium text-text-primary">{label}</h3>
                  </div>
                  <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-text-muted mt-1">{sub}</p>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeIn delay={0.3}>
          <Card className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-accent-primary" />
              <h2 className="font-display text-lg font-semibold text-text-primary">Your Progress</h2>
            </div>
            <ProgressBar value={user.xp % 100} max={100} size="md" />
            <div className="flex justify-between mt-2 text-xs text-text-muted">
              <span>Level {user.level}</span>
              <span>{user.xp % 100}/100 XP to next level</span>
            </div>
          </Card>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="flex flex-wrap gap-4">
            <Link to="/paths">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button variant="primary" className="text-base px-8 py-3">
                  <Code className="w-5 h-5" />
                  Browse Learning Paths
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </FadeIn>

        {/* Decorative bottom gradient */}
        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-accent-primary/20 to-transparent" />
      </main>
    </div>
  )
}
