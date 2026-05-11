import { createFileRoute } from '@tanstack/react-router'
import { submissions, submissionStatusColors } from '@/lib/mock-data.ts'
import { PageHeader, Breadcrumb } from '@/components/ui/page-header.tsx'
import { useUiStore } from '@/stores/ui-store.ts'
import { Button } from '@/components/ui/button.tsx'
import { CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/app/admin/review/')({ component: ReviewQueue })

function ReviewQueue() {
  const { openConfirm, pushDummyToast } = useUiStore()
  const [filter, setFilter] = useState<string | null>(null)
  const pending = submissions.filter((s) => s.status === 'Running' || s.status === 'Queued')

  return (
    <div>
      <Breadcrumb items={[{ label: 'Admin' }, { label: 'Review Queue' }]} />
      <PageHeader title="Review Queue" description="Pending submissions requiring review." />

      <div className="flex gap-2 mb-6">
        {['All', 'Pending', 'Passed', 'Failed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f === 'All' ? null : f)}
            className={`rounded-full px-3 py-1 text-xs border transition-colors ${
              (filter === null && f === 'All') || filter === f
                ? 'border-hairline-strong bg-surface-elevated text-on-dark'
                : 'border-hairline text-body hover:text-on-dark'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-hairline overflow-hidden">
        {pending.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-4 py-3 border-b border-hairline last:border-0 hover:bg-surface-elevated transition-colors">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-mute">{s.id}</span>
              <span className="text-sm text-on-dark">{s.challengeName}</span>
              <span className={`text-xs font-medium ${submissionStatusColors[s.status]}`}>{s.status}</span>
              <span className="text-xs text-mute">{s.submittedAt}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="xs" onClick={() => openConfirm('Approve Submission', 'This will mark the submission as approved and scores will be published.', 'Approved submission')}>
                <CheckCircle className="size-3 text-accent-green" /> Approve
              </Button>
              <Button variant="ghost" size="xs" onClick={() => openConfirm('Reject Submission', 'This will invalidate the submission and notify the participant.', 'Rejected submission')}>
                <XCircle className="size-3 text-accent-red" /> Reject
              </Button>
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <div className="p-8 text-center text-mute text-sm">No submissions pending review.</div>
        )}
      </div>
    </div>
  )
}
