import { createFileRoute } from '@tanstack/react-router'
import { runs } from '@/lib/mock-data.ts'
import { PageHeader, Breadcrumb } from '@/components/ui/page-header.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUiStore } from '@/stores/ui-store.ts'
import { requireRole } from '#/lib/route-guards'

export const Route = createFileRoute( '/app/admin/audit/' )( {
  beforeLoad: () => requireRole( ['admin'] ),
  component: AuditLog,
} )

function AuditLog() {
  const pushDummyToast = useUiStore( ( s ) => s.pushDummyToast )

  return (
    <div>
      <Breadcrumb items={[{ label: 'Admin' }, { label: 'Audit Log' }]} />
      <PageHeader title="Audit Log" description="Run history and dispute records." />

      <div className="rounded-lg border border-hairline overflow-hidden">
        {runs.map( ( run ) => (
          <div key={run.id} className="flex items-center justify-between px-4 py-3 border-b border-hairline last:border-0 hover:bg-surface-elevated transition-colors">
            <div>
              <p className="text-sm text-on-dark font-mono">{run.id}</p>
              <p className="text-xs text-mute mt-0.5">Submission {run.submissionId} — {run.completedAt}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-body">
              <span>{run.p99LatencyMs}ms</span>
              <span>{run.throughput.toLocaleString()} ops</span>
              <span>{run.correctness}%</span>
              <Button variant="ghost" size="xs" onClick={() => pushDummyToast( 'Dispute details opened' )}>View</Button>
            </div>
          </div>
        ) )}
      </div>
    </div>
  )
}
