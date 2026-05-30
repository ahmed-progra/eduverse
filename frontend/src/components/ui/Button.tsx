import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  isLoading?: boolean
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-accent-primary text-white hover:bg-accent-primary/90 shadow-lg shadow-accent-primary/25',
  secondary:
    'bg-bg-elevated text-text-primary border border-bg-border hover:bg-bg-border hover:border-text-muted',
  success:
    'bg-accent-success text-white hover:bg-accent-success/90 shadow-lg shadow-accent-success/25',
  danger:
    'bg-accent-danger text-white hover:bg-accent-danger/90 shadow-lg shadow-accent-danger/25',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading, children, disabled, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl
          font-medium text-sm transition-all duration-200
          active:scale-[0.97] hover:scale-[1.02]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
