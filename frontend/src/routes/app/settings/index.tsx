import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/ui/page-header.tsx'
import { DataCard } from '@/components/ui/data-cards.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUiStore } from '@/stores/ui-store.ts'

export const Route = createFileRoute('/app/settings/')({ component: Settings })

function Settings() {
  const pushDummyToast = useUiStore((s) => s.pushDummyToast)

  return (
    <div>
      <PageHeader title="Settings" description="Application preferences and configuration." />

      <div className="space-y-6 max-w-lg">
        <DataCard title="Appearance" className="[&>h3]:text-on-dark">
          <p className="text-sm text-body mb-4">Theme is locked to dark mode for consistent benchmarking display.</p>
          <Button variant="secondary" size="sm" disabled>Dark Mode (Active)</Button>
        </DataCard>

        <DataCard title="Notifications" className="[&>h3]:text-on-dark">
          <div className="space-y-3">
            {['Submission complete', 'Run finished', 'Leaderboard change', 'Challenge updates'].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm text-body">{item}</span>
                <Button variant="secondary" size="xs" onClick={() => pushDummyToast(`${item} preference updated`)}>On</Button>
              </div>
            ))}
          </div>
        </DataCard>

        <DataCard title="Keyboard Shortcuts" className="[&>h3]:text-on-dark">
          <div className="space-y-2 text-sm">
            {[
              { keys: '⌘K', action: 'Command palette' },
              { keys: '⌘B', action: 'Toggle sidebar' },
              { keys: 'Esc', action: 'Close dialogs' },
            ].map((item) => (
              <div key={item.action} className="flex justify-between">
                <span className="text-body">{item.action}</span>
                <kbd className="rounded border border-hairline bg-surface-card px-1.5 py-0.5 text-xs text-body font-mono">{item.keys}</kbd>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </div>
  )
}
