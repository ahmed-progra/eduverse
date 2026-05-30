import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, BookOpen } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useTitle } from '../hooks/useTitle'

export default function NotFound() {
  useTitle('Page not found')

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <BookOpen className="w-16 h-16 text-accent-primary/30 mx-auto mb-6" />
        <h1 className="font-display text-6xl font-bold text-text-primary mb-2">404</h1>
        <p className="text-text-secondary mb-8">This page doesn't exist yet — or maybe it's behind a paywall of the universe.</p>
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
