import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function TypeWriter({ text, speed = 50, delay = 0, className = '' }: {
  text: string; speed?: number; delay?: number; className?: string
}) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(interval)
    }, speed)
    return () => clearInterval(interval)
  }, [started, text, speed])

  return <span className={className}>{displayed}<span className="animate-pulse">|</span></span>
}

export function FadeIn({ children, delay = 0, direction = 'up', className = '' }: {
  children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right'; className?: string
}) {
  const dirMap = { up: { y: 30 }, down: { y: -30 }, left: { x: 30 }, right: { x: -30 } }
  return (
    <motion.div
      initial={{ opacity: 0, ...dirMap[direction] }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerChildren({ children, staggerDelay = 0.1, className = '' }: {
  children: React.ReactNode; staggerDelay?: number; className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: staggerDelay } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }: {
  children: React.ReactNode; className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedCounter({ value, duration = 1000, suffix = '' }: {
  value: number; duration?: number; suffix?: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = value / (duration / 16)
    const interval = setInterval(() => {
      start += increment
      if (start >= value) { setCount(value); clearInterval(interval) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(interval)
  }, [value, duration])

  return <span>{count}{suffix}</span>
}

export function GlowCard({ children, className = '' }: {
  children: React.ReactNode; className?: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`relative group ${className}`}
    >
      <div className="absolute -inset-[1px] bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-all duration-500" />
      <div className="relative bg-bg-elevated border border-bg-border rounded-xl p-6 h-full transition-all duration-300 group-hover:border-transparent">
        {children}
      </div>
    </motion.div>
  )
}
