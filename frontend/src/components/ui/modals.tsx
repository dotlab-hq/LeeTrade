import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.tsx'
import { useUiStore } from '@/stores/ui-store.ts'
import { Button } from '@/components/ui/button.tsx'
import { Command } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

export function ConfirmDialog() {
  const { confirm, closeConfirm, confirmNow } = useUiStore()

  return (
    <Dialog open={confirm.open} onOpenChange={closeConfirm}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{confirm.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-body">{confirm.description}</p>
        <DialogFooter>
          <Button variant="ghost" onClick={closeConfirm}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmNow}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function CommandDialog() {
  const { isCommandOpen, setCommandOpen, pushDummyToast } = useUiStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const commands = [
    { id: 'dashboard', label: 'Go to Dashboard', action: () => navigate({ to: '/app' }) },
    { id: 'challenges', label: 'View Challenges', action: () => navigate({ to: '/challenges' }) },
    { id: 'leaderboard', label: 'View Leaderboard', action: () => navigate({ to: '/leaderboard' }) },
    { id: 'submissions', label: 'My Submissions', action: () => navigate({ to: '/app/submissions' }) },
    { id: 'profile', label: 'Go to Profile', action: () => navigate({ to: '/app/profile' }) },
    { id: 'new-submission', label: 'New Submission', action: () => navigate({ to: '/app/submissions/new' }) },
    { id: 'review-queue', label: 'Review Queue', action: () => navigate({ to: '/app/admin/review' }) },
    { id: 'audit-log', label: 'Audit Log', action: () => navigate({ to: '/app/admin/audit' }) },
  ]

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <Dialog open={isCommandOpen} onOpenChange={setCommandOpen}>
      <DialogContent className="sm:max-w-lg p-0">
        <div className="flex items-center gap-2 border-b border-hairline px-3 py-2">
          <Command className="size-4 text-mute" />
          <input
            type="text"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            autoFocus
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => {
                cmd.action()
                setCommandOpen(false)
                setQuery('')
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-surface-elevated"
            >
              {cmd.label}
            </button>
          ))}
          {filtered.length === 0 && <p className="px-2 py-4 text-center text-sm text-mute">No commands found</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}