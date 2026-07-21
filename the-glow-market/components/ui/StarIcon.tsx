import { cn } from '@/lib/utils'

interface StarIconProps {
  className?: string
  size?: number
  animate?: boolean
}

export default function StarIcon({ className, size = 24, animate = false }: StarIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn(animate && 'animate-spin-slow', className)}
      aria-hidden="true"
    >
      <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
    </svg>
  )
}
