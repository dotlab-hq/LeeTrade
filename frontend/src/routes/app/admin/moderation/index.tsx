import { createFileRoute, Link } from '@tanstack/react-router'
import { submissions } from '@/lib/mock-data.ts'
import { PageHeader, Breadcrumb } from '@/components/ui/page-header.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUiStore } from '@/stores/ui-store.ts'

export const Route = createFileRoute('/app/admin/moderation/')({ component: ModerationHistory })

function ModerationHistory() {
  const pushDummyToast = useUiStore((s) => s.pushDummyToast)

  return (
    <div>
      <Breadcrumb items={[{ label: 'Admin' }, { label: 'Moderation' }]} />
      <PageHeader title="Moderation History" description="Record of invalidations and actions taken." />

      <div className="rounded-lg border border-hairline overflow-hidden">
        {submissions.filter((s) => s.status === 'Failed').map((s) => (
          <div key={s.id} className="flex items-center justify-between px-4 py-3 border-b border-hairline last:border-0 hover:bg-surface-elevated transition-colors">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-mute">{s.id}</span>
                <span className="text-sm text-on-dark">{s.challengeName}</span>
                <span className="text-xs text-accent-red">Failed</span>
              </div>
              <p className="text-xs text-mute mt-0.5">{s.submittedAt}</p>
            </div>
            <Button asChild variant="ghost" size="xs">
              <Link to="/app/submissions/$submissionId" params={{ submissionId: s.id }}>Review</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
