import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'outline-white' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-montserrat tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-glow-navy text-white hover:bg-glow-blue',
      outline: 'border border-glow-navy text-glow-navy hover:bg-glow-navy hover:text-white',
      'outline-white': 'border border-white text-white hover:bg-white hover:text-glow-navy',
      ghost: 'text-glow-navy hover:opacity-60',
    }

    const sizes = {
      sm: 'text-[10px] px-5 py-3',
      md: 'text-xs px-8 py-4',
      lg: 'text-xs px-10 py-5',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
