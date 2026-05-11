import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X, Home, Trophy, BarChart3, User, Settings, Send, Play, History } from 'lucide-react'
import { useUiStore } from '@/stores/ui-store.ts'
import { cn } from '@/lib/utils.ts'
import { buttonVariants } from './button.tsx'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/challenges', label: 'Challenges', icon: Trophy },
  { to: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
]

const appNavItems = [
  { to: '/app', label: 'Dashboard', icon: Home },
  { to: '/app/submissions', label: 'Submissions', icon: Send },
  { to: '/app/runs', label: 'Runs', icon: Play },
  { to: '/app/replays', label: 'Replays', icon: History },
  { to: '/app/profile', label: 'Profile', icon: User },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export function TopNav() {
  const { role, setMobileNavOpen, setCommandOpen } = useUiStore()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairline bg-surface-strong/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-lg font-semibold text-ink">
            LeetTrade
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map( ( item ) => (
              <NavLink key={item.to} to={item.to} label={item.label} />
            ) )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={role}
            onChange={( e ) => useUiStore.getState().setRole( e.target.value as any )}
            className="rounded-md border border-hairline bg-surface px-2 py-1 text-sm"
          >
            <option value="contestant">Contestant</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>

          <button
            onClick={() => setCommandOpen( true )}
            className="hidden items-center gap-2 rounded-md border border-hairline bg-surface px-3 py-1.5 text-sm hover:bg-surface-elevated md:flex"
          >
            <span className="text-mute">Search...</span>
            <kbd className="rounded border border-hairline-strong bg-surface-elevated px-1.5 text-xs">⌘K</kbd>
          </button>

          <button
            onClick={() => setMobileNavOpen( true )}
            className="rounded-md p-2 hover:bg-surface-elevated md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export function SideNav() {
  const location = useRouterState( { select: ( s ) => s.location.pathname } )

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-hairline bg-surface-strong pt-14 md:block">
      <nav className="flex flex-col gap-1 p-3">
        {appNavItems.map( ( item ) => {
          const active = location.startsWith( item.to ) && item.to !== '/app'
            ? location.startsWith( item.to )
            : location === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                buttonVariants( { variant: active ? 'secondary' : 'ghost' } ),
                'justify-start gap-2'
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        } )}
      </nav>
    </aside>
  )
}

export function MobileNav() {
  const { isMobileNavOpen, setMobileNavOpen } = useUiStore()
  const location = useRouterState( { select: ( s ) => s.location.pathname } )

  if ( !isMobileNavOpen ) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
      <div className="absolute left-0 top-0 h-full w-72 border-r border-hairline bg-surface-strong p-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-lg font-semibold text-ink">
            LeetTrade
          </Link>
          <button onClick={() => setMobileNavOpen( false )} className="rounded p-2 hover:bg-surface-elevated">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map( ( item ) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileNavOpen( false )}
              className={cn(
                buttonVariants( { variant: location === item.to ? 'secondary' : 'ghost' } ),
                'justify-start gap-2'
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ) )}
        </nav>
      </div>
    </div>
  )
}

function NavLink( { to, label }: { to: string; label: string } ) {
  const location = useRouterState( { select: ( s ) => s.location.pathname } )
  const active = location === to || ( to !== '/' && location.startsWith( to ) )

  return (
    <Link
      to={to}
      className={cn(
        'px-3 py-1.5 text-sm transition-colors',
        active ? 'text-ink' : 'text-body hover:text-ink'
      )}
    >
      {label}
    </Link>
  )
}