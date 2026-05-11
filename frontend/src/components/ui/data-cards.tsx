import { cn } from '@/lib/utils.ts'

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
  return (
    <div className="rounded-lg border border-hairline bg-surface p-4">
      <p className="text-xs text-body">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
      {delta !== undefined && (
        <p
          className={cn(
            'mt-1 text-xs',
            deltaPositive ? 'text-accent-green' : 'text-accent-red'
          )}
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
  return (
    <div className={cn( 'rounded-lg border border-hairline bg-surface p-4', className )}>
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
  return (
    <div
      className={cn( 'animate-pulse rounded-md bg-surface-elevated', className )}
    />
  )
}