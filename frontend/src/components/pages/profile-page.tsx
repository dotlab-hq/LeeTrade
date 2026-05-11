import React, { useState } from 'react'
import { useMe, useSignOut } from '#/hooks/api'
import { useAuthStore } from '#/lib/auth-store'
import { Mail, Bell, Keyboard, LogOut } from 'lucide-react'

export function ProfilePage() {
  const { data: sessionData } = useMe()
  const signOut = useSignOut()
  const setUser = useAuthStore((s) => s.setUser)

  const user = sessionData?.user
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnCompletion: true,
    emailOnFailure: true,
    emailOnRank: true,
    emailOnNewChallenge: false,
  })

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await signOut.mutateAsync()
      } catch (e) {
        console.error('Logout failed:', e)
      }
      setUser(null)
      window.location.href = '/signin'
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-ink mb-8">Settings</h1>

      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              readOnly
              className="w-full px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark outline-none cursor-not-allowed opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
            <div className="flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-hairline rounded-md">
              <Mail className="w-4 h-4 text-mute" />
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="flex-1 bg-transparent text-on-dark outline-none cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Role</label>
            <div className="px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark capitalize">
              {user?.role || 'viewer'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>
        <div className="space-y-4">
          {[
            { key: 'emailOnCompletion', label: 'Email when submission completes', description: 'Get notified when your benchmark run finishes' },
            { key: 'emailOnFailure', label: 'Email on submission failure', description: 'Get notified if your submission fails' },
            { key: 'emailOnRank', label: 'Email on rank changes', description: 'Get notified when your leaderboard rank changes' },
            { key: 'emailOnNewChallenge', label: 'Email on new challenges', description: 'Get notified when new challenges are available' },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between py-3 border-b border-hairline last:border-0">
              <div>
                <p className="font-medium text-ink">{setting.label}</p>
                <p className="text-xs text-mute">{setting.description}</p>
              </div>
              <button
                onClick={() =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    [setting.key]: !prev[setting.key as keyof typeof notificationSettings],
                  }))
                }
                className={`w-12 h-6 rounded-full transition-colors flex items-center ${
                  notificationSettings[setting.key as keyof typeof notificationSettings]
                    ? 'bg-accent-green'
                    : 'bg-surface-elevated'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-on-dark transition-transform ${
                    notificationSettings[setting.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
          <Keyboard className="w-5 h-5" />
          Keyboard Shortcuts
        </h2>
        <div className="space-y-2 text-sm text-body">
          <div className="flex justify-between">
            <span>Open command palette</span>
            <kbd className="px-2 py-1 bg-surface-card rounded border border-hairline text-xs">Cmd+K</kbd>
          </div>
          <div className="flex justify-between">
            <span>Go to submissions</span>
            <kbd className="px-2 py-1 bg-surface-card rounded border border-hairline text-xs">Cmd+S</kbd>
          </div>
          <div className="flex justify-between">
            <span>Go to challenges</span>
            <kbd className="px-2 py-1 bg-surface-card rounded border border-hairline text-xs">Cmd+T</kbd>
          </div>
          <div className="flex justify-between">
            <span>Go to leaderboard</span>
            <kbd className="px-2 py-1 bg-surface-card rounded border border-hairline text-xs">Cmd+L</kbd>
          </div>
        </div>
      </div>

      <div className="bg-accent-red-soft border border-accent-red rounded-lg p-6">
        <h2 className="text-lg font-bold text-accent-red mb-4">Danger Zone</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-accent-red hover:bg-red-700 text-on-dark font-medium rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}