import { cn } from '@/lib/utils.ts'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function StatsCard( {
  label,
  value,
  delta,
  deltaPositive,
}: {
  label: string
  value: string | number
  delta?: string | number
  deltaPositive?: boolean
} ) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="rounded-lg border border-hairline bg-surface p-4 group cursor-default"
      style={{
        transition: prefersReducedMotion
          ? 'none'
          : 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        if (!prefersReducedMotion) {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (!prefersReducedMotion) {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }
      }}
    >
      <p className="text-xs text-body">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            'mt-1 text-xs',
            deltaPositive ? 'text-accent-green' : 'text-accent-red'
          )}
          style={{
            animation: !prefersReducedMotion && deltaPositive
              ? 'score-up 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              : 'none',
          }}
        >
          {deltaPositive ? '+' : ''}
          {delta}
        </p>
      )}
    </div>
  )
}

export function DataCard( {
  title,
  description,
  children,
  className,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
} ) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={cn(
        'rounded-lg border border-hairline bg-surface p-4 group',
        className
      )}
      style={{
        transition: prefersReducedMotion
          ? 'none'
          : 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        if (!prefersReducedMotion) {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (!prefersReducedMotion) {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }
      }}
    >
      <h3 className="mb-1 font-medium text-ink">{title}</h3>
      {description && <p className="mb-3 text-sm text-body">{description}</p>}
      {children}
    </div>
  )
}

export function EmptyState( {
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
} ) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-hairline border-dashed bg-surface p-8 text-center">
      <h3 className="mb-1 font-medium text-ink">{title}</h3>
      {description && <p className="mb-4 text-sm text-body">{description}</p>}
      {action}
    </div>
  )
}

export function SkeletonBlock( {
  className,
}: {
  className?: string
} ) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={cn( 'rounded-md bg-surface-elevated', className )}
      style={{
        animation: !prefersReducedMotion
          ? 'pulse 1500ms cubic-bezier(0.4, 0, 0.6, 1) infinite'
          : 'none',
      }}
    />
  )
}
