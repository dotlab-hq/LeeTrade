import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import { cn } from '@/lib/utils.ts'
import { useUiStore } from '@/stores/ui-store.ts'

export function PageWrap( { children }: { children: React.ReactNode } ) {
  return <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6">{children}</main>
}

export function PageTitle( {
  title,
  subtitle,
}: {
  title: string
  subtitle: string
} ) {
  return (
    <header className="mb-8 space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{title}</h1>
      <p className="max-w-3xl text-sm text-body md:text-base">{subtitle}</p>
    </header>
  )
}

export function Panel( {
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
} ) {
  return (
    <section className={cn( 'rounded-lg border border-hairline bg-surface p-4 md:p-6', className )}>
      <h2 className="mb-4 text-lg font-medium text-ink">{title}</h2>
      {children}
    </section>
  )
}

export function StatusBadge( { value }: { value: string } ) {
  return (
    <span className="inline-flex rounded-full border border-hairline-strong bg-surface-elevated px-2.5 py-1 text-xs text-body">
      {value}
    </span>
  )
}

export function Grid2( { children }: { children: React.ReactNode } ) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>
}

export function Grid3( { children }: { children: React.ReactNode } ) {
  return <div className="grid gap-4 md:grid-cols-3">{children}</div>
}

export function DummyActionButton( { label }: { label: string } ) {
  const pushDummyToast = useUiStore( ( state ) => state.pushDummyToast )
  return (
    <Button variant="secondary" onClick={() => pushDummyToast( label )}>
      {label}
    </Button>
  )
}

export function RouteJumpButton( {
  label,
  to,
}: {
  label: string
  to: string
} ) {
  return (
    <Button asChild>
      <Link to={to}>{label}</Link>
    </Button>
  )
}
