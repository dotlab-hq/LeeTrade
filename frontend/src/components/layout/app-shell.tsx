import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from '@tanstack/react-router'
import { useAuthStore } from '#/lib/auth-store'
import { Menu, X, LogOut, User, Settings, BarChart3 } from 'lucide-react'

export function AppShell() {
  const { user, logout, setRole } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate({ to: '/signin' })
  }

  const navItems = [
    { label: 'Dashboard', icon: BarChart3, href: '/app' },
    { label: 'Submissions', icon: BarChart3, href: '/app/submissions' },
    { label: 'Challenges', icon: BarChart3, href: '/challenges' },
    { label: 'Leaderboard', icon: BarChart3, href: '/leaderboard' },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="flex h-screen bg-canvas">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-surface border-r border-hairline transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-hairline">
          <h2 className="text-xl font-bold text-ink">LeetTrade</h2>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.href}
                onClick={() => navigate({ to: item.href as any })}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-surface-elevated text-ink'
                    : 'text-body hover:bg-surface-elevated'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Role Selector & Logout */}
        <div className="p-4 space-y-3 border-t border-hairline">
          <div className="flex items-center gap-2 px-2 py-1">
            <User className="w-4 h-4 text-mute" />
            <select
              value={user?.role || 'contestant'}
              onChange={(e) => setRole(e.target.value as any)}
              className="flex-1 bg-surface-elevated text-on-dark text-xs rounded px-2 py-1 border border-hairline outline-none"
            >
              <option value="contestant">Contestant</option>
              <option value="organizer">Organizer</option>
              <option value="judge">Judge</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-accent-red hover:bg-surface-elevated rounded-md transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Nav */}
        <div className="h-16 bg-surface border-b border-hairline flex items-center px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-surface-elevated rounded-md transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <span className="text-sm text-body">{user?.name}</span>
            <button
              onClick={() => navigate({ to: '/app/profile' })}
              className="p-2 hover:bg-surface-elevated rounded-md transition-colors"
            >
              <Settings className="w-5 h-5 text-mute" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
