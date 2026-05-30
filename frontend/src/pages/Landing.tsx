import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Code, Brain } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useTitle } from '../hooks/useTitle'

export default function Landing() {
  useTitle('')

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-primary" />
            <span className="font-display text-xl font-bold gradient-text">EduVerse</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
              Log in
            </Link>
            <Link to="/signup">
              <Button variant="primary" className="text-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl md:text-7xl font-bold text-text-primary leading-tight"
          >
            Master{' '}
            <span className="gradient-text">Programming</span>
            <br />
            <span className="gradient-text">Math & Physics</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Interactive courses, real-time coding, AI-powered tutoring, and gamified learning paths.
            Your journey to mastery starts here.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <Link to="/signup">
              <Button variant="primary" className="text-base px-8 py-3">
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: 'Programming',
                desc: 'Python, JavaScript, TypeScript, algorithms & data structures',
              },
              {
                icon: Brain,
                title: 'Mathematics',
                desc: 'From algebra to calculus, linear algebra to statistics',
              },
              {
                icon: BookOpen,
                title: 'Physics',
                desc: 'Classical mechanics, electromagnetism, thermodynamics & more',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * i + 0.6 }}
                className="bg-bg-elevated border border-bg-border rounded-2xl p-8 hover:border-accent-primary/30 transition-all duration-300"
              >
                <item.icon className="w-10 h-10 text-accent-primary mb-4" />
                <h3 className="font-display text-xl font-semibold text-text-primary mb-3">{item.title}</h3>
                <p className="text-text-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
