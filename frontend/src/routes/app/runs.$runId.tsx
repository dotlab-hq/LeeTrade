import { createFileRoute, Link } from '@tanstack/react-router'
import { getRunById } from '@/lib/mock-data.ts'
import { PageHeader, Breadcrumb, SectionHeader } from '@/components/ui/page-header.tsx'
import { DataCard, StatsCard } from '@/components/ui/data-cards.tsx'
import { Grid3 } from '@/components/app/page-primitives.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUiStore } from '@/stores/ui-store.ts'
import { Download } from 'lucide-react'

export const Route = createFileRoute('/app/runs/$runId')({
  component: RunDetail,
  notFoundComponent: () => <div className="py-24 text-center text-body">Run not found</div>,
})

function RunDetail() {
  const { runId } = Route.useParams()
  const run = getRunById(runId)
  const pushDummyToast = useUiStore((s) => s.pushDummyToast)

  if (!run) return null

  return (
    <div>
      <Breadcrumb items={[{ label: 'Submissions', to: '/app/submissions' }, { label: `Run ${run.id}` }]} />
      <PageHeader
        title={`Run ${run.id}`}
        description={`Started ${run.startedAt} — Completed ${run.completedAt}`}
        actions={
          <Button variant="secondary" size="sm" onClick={() => pushDummyToast('Export initiated')}>
            <Download className="size-4" /> Export
          </Button>
        }
      />

      <Grid3>
        <StatsCard label="P99 Latency" value={`${run.p99LatencyMs}ms`} />
        <StatsCard label="Avg Latency" value={`${run.avgLatencyMs}ms`} />
        <StatsCard label="Throughput" value={`${run.throughput.toLocaleString()} ops/s`} />
        <StatsCard label="Correctness" value={`${run.correctness}%`} deltaPositive={run.correctness > 95} />
        <DataCard title="Duration" className="[&>h3]:text-on-dark">
          <p className="text-lg font-semibold text-on-dark">{run.completedAt ? '45s' : '—'}</p>
        </DataCard>
        <DataCard title="Status" className="[&>h3]:text-on-dark">
          <p className="text-sm text-accent-green font-medium">Completed</p>
        </DataCard>
      </Grid3>

      <div className="mt-8">
        <SectionHeader title="Latency Distribution" description="P50 / P95 / P99 latency percentiles" />
        <div className="rounded-lg border border-hairline bg-surface p-6">
          <div className="flex items-end gap-2 h-32">
            {[1.2, 2.1, 3.7, 1.8, 2.5, 1.0, 3.2, 2.8, 4.1, 1.5, 2.0, 3.0].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all"
                style={{
                  height: `${(v / 5) * 100}%`,
                  backgroundColor: v >= 3.5 ? 'var(--accent-red)' : v >= 2.5 ? 'var(--accent-yellow)' : 'var(--accent-green)',
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-mute mt-2">
            <span>00:00</span>
            <span>00:15</span>
            <span>00:30</span>
            <span>00:45</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <SectionHeader title="Event Feed" />
        <div className="rounded-lg border border-hairline overflow-hidden">
          {run.events.map((e, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-hairline last:border-0 text-sm">
              <span className="text-mute text-xs font-mono w-14">{e.time}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                e.type === 'complete' ? 'bg-accent-green-soft text-accent-green' :
                e.type === 'phase' ? 'bg-accent-blue-soft text-accent-blue' :
                'bg-surface-elevated text-mute'
              }`}>
                {e.type}
              </span>
              <span className="text-body">{e.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Button variant="secondary" onClick={() => pushDummyToast('Report generated')}>Generate Report</Button>
        <Button variant="ghost" onClick={() => pushDummyToast('Report submitted')}>Submit Report</Button>
      </div>
    </div>
  )
}
