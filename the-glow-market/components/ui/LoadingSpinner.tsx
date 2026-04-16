import { cn } from '@/lib/utils'
import StarIcon from './StarIcon'

interface LoadingSpinnerProps {
  className?: string
  size?: number
  fullPage?: boolean
}

export default function LoadingSpinner({ className, size = 24, fullPage = false }: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn('flex items-center justify-center', className)}>
      <StarIcon
        size={size}
        className="text-glow-navy animate-spin"
        style={{ animationDuration: '2s' } as React.CSSProperties}
      />
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-glow-cream/80 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}
