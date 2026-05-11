import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils.ts'

export function PageHeader( {
  title,
  description,
  actions,
  backTo,
  backLabel,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  backTo?: string
  backLabel?: string
} ) {
  return (
    <header className="mb-6 space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          {backTo && (
            <Link
              to={backTo}
              className="flex items-center gap-1 text-sm text-body hover:text-ink"
            >
              <ChevronRight className="size-3 rotate-180" />
              {backLabel || 'Back'}
            </Link>
          )}
          <h1 className="text-2xl font-semibold text-ink">{title}</h1>
          {description && <p className="text-sm text-body">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}

export function Breadcrumb( {
  items,
}: {
  items: { label: string; to?: string }[]
} ) {
  return (
    <nav className="mb-4 flex items-center gap-1 text-sm text-mute">
      {items.map( ( item, i ) => (
        <div key={i} className="flex items-center gap-1">
          {item.to ? (
            <Link to={item.to} className="hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-body">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="size-3" />}
        </div>
      ) )}
    </nav>
  )
}

export function SectionHeader( {
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
} ) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-medium text-ink">{title}</h2>
        {description && <p className="text-sm text-body">{description}</p>}
      </div>
      {action}
    </div>
  )
}