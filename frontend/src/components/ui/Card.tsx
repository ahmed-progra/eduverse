import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-bg-elevated border border-bg-border rounded-xl p-6
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
