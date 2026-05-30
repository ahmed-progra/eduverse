import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Code, Brain, Zap, Star, ChevronRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useTitle } from '../hooks/useTitle'
import { TypeWriter, FadeIn, StaggerChildren, StaggerItem } from '../components/ui/TextAnimation'

const floatingIcons = [
  { Icon: Code, x: '15%', y: '20%', delay: 0, color: '#6366f1' },
  { Icon: Brain, x: '80%', y: '15%', delay: 1, color: '#f59e0b' },
  { Icon: Zap, x: '85%', y: '70%', delay: 2, color: '#10b981' },
  { Icon: Star, x: '10%', y: '75%', delay: 0.5, color: '#ec4899' },
]

export default function Landing() {
  useTitle('')
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const controls = animate(count, 5000, { duration: 2, ease: 'easeOut' })
    return controls.stop
  }, [count])

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div className="min-h-screen bg-bg-base overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent-secondary/5 via-transparent to-transparent pointer-events-none" />

      {/* Floating icons */}
      {floatingIcons.map(({ Icon, x, y, delay, color }) => (
        <motion.div
          key={x}
          className="absolute pointer-events-none"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.15, 0.1, 0.15],
            scale: [0, 1, 1, 1],
            y: [0, -10, 0, -10],
          }}
          transition={{ duration: 6, delay, repeat: Infinity, repeatType: 'reverse' }}
        >
          <Icon className="w-16 h-16 md:w-24 md:h-24" style={{ color }} />
        </motion.div>
      ))}

      <header className="relative z-10 border-b border-bg-border/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-primary" />
            <span className="font-display text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              EduVerse
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
              Log in
            </Link>
            <Link to="/signup">
              <Button variant="primary" className="text-sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <FadeIn>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-medium mb-8"
            >
              <Zap className="w-4 h-4" />
              New: C++ Programming Path
            </motion.div>
          </FadeIn>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
            <FadeIn delay={0.1}>
              Master{' '}
              <span className="bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-success bg-clip-text text-transparent">
                <TypeWriter text="C++ Programming" speed={60} delay={400} />
              </span>
            </FadeIn>
            <br />
            <FadeIn delay={0.8}>
              <span className="gradient-text">&</span>{' '}
              <span className="bg-gradient-to-r from-accent-secondary via-accent-success to-accent-primary bg-clip-text text-transparent">
                <TypeWriter text="Math & Physics" speed={60} delay={1800} />
              </span>
            </FadeIn>
          </h1>

          <FadeIn delay={1.6}>
            <p className="mt-6 text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Interactive courses, real-time coding, AI-powered tutoring, and gamified learning paths.
              <br />
              <span className="text-text-primary font-medium">
                Your journey to mastery starts here.
              </span>
            </p>
          </FadeIn>

          <FadeIn delay={2.2}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/signup">
                <Button variant="primary" className="text-base px-8 py-3 text-lg">
                  Start Learning Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" className="text-base px-8 py-3 text-lg">
                  Continue Learning
                </Button>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={2.8}>
            <div className="mt-16 flex items-center justify-center gap-8 md:gap-16 text-center">
              {[
                { label: 'Active Learners', value: '5,000+' },
                { label: 'Courses', value: '3' },
                { label: 'Lessons', value: '10+' },
                { label: 'XP to Earn', value: `${Math.round(rounded.get())}+` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-2xl md:text-3xl font-display font-bold gradient-text">{value}</p>
                  <p className="text-xs text-text-muted mt-1">{label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary text-center mb-4">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Learning Path
              </span>
            </h2>
            <p className="text-text-secondary text-center mb-12 max-w-xl mx-auto">
              Three tracks designed to take you from zero to confident — at your own pace.
            </p>
          </FadeIn>

          <StaggerChildren staggerDelay={0.15} className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Code,
                title: 'C++ Programming',
                desc: 'Start with the language that powers everything. From variables to pointers — build real C++ skills from day one.',
                gradient: 'from-accent-primary to-blue-500',
                features: ['Variables & Types', 'Control Flow', 'Functions', 'Pointers & Memory'],
                color: '#6366f1',
              },
              {
                icon: Brain,
                title: 'Mathematics',
                desc: 'Build a rock-solid math foundation. Master algebra, functions, and equations with step-by-step guidance.',
                gradient: 'from-accent-secondary to-orange-500',
                features: ['Algebra Basics', 'Linear Functions', 'Systems of Equations'],
                color: '#f59e0b',
              },
              {
                icon: BookOpen,
                title: 'Physics',
                desc: 'Understand the laws that govern the universe. Motion, forces, energy — explained intuitively with real examples.',
                gradient: 'from-accent-success to-emerald-500',
                features: ["Newton's Laws", 'Work & Energy', 'Momentum'],
                color: '#10b981',
              },
            ].map(({ icon: Icon, title, desc, gradient, features, color }) => (
              <StaggerItem key={title}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group h-full"
                >
                  <div className={`absolute -inset-[1px] bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-all duration-500`} />
                  <div className="relative bg-bg-elevated border border-bg-border rounded-2xl p-8 h-full transition-all duration-300 group-hover:border-transparent">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
                      {title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed text-sm mb-6">{desc}</p>
                    <ul className="space-y-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-text-muted">
                          <ChevronRight className="w-3.5 h-3.5" style={{ color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <FadeIn>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative inline-block"
            >
              <div className="absolute -inset-8 bg-gradient-to-r from-accent-primary/20 via-accent-secondary/20 to-accent-success/20 rounded-3xl blur-2xl" />
              <div className="relative bg-bg-elevated border border-bg-border rounded-3xl p-12 md:p-16">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Ready to Start Learning?
                </h2>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Join thousands of learners mastering C++, math, and physics. No credit card required.
                </p>
                <Link to="/signup">
                  <Button variant="primary" className="text-base px-10 py-3">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </FadeIn>
        </section>

        <footer className="border-t border-bg-border py-8 text-center text-sm text-text-muted">
          EduVerse — Learn C++, Math & Physics. All rights reserved.
        </footer>
      </main>
    </div>
  )
}
