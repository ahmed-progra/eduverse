interface BadgeProps {
  children: React.ReactNode
  variant?: 'beginner' | 'intermediate' | 'advanced' | 'default'
  className?: string
}

const variantStyles: Record<string, string> = {
  beginner: 'bg-accent-success/15 text-accent-success border-accent-success/30',
  intermediate: 'bg-accent-secondary/15 text-accent-secondary border-accent-secondary/30',
  advanced: 'bg-accent-danger/15 text-accent-danger border-accent-danger/30',
  default: 'bg-bg-border text-text-secondary border-text-muted/30',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-medium border
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
