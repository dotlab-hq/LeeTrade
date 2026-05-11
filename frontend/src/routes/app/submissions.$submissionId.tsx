import { createFileRoute, Link } from '@tanstack/react-router'
import { getSubmissionById, runs, submissionStatusColors } from '@/lib/mock-data.ts'
import { PageHeader, Breadcrumb } from '@/components/ui/page-header.tsx'
import { DataCard, StatsCard } from '@/components/ui/data-cards.tsx'
import { Grid2, Grid3 } from '@/components/app/page-primitives.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUiStore } from '@/stores/ui-store.ts'
import { Play } from 'lucide-react'

export const Route = createFileRoute('/app/submissions/$submissionId')({
  component: SubmissionDetail,
  notFoundComponent: () => <div className="py-24 text-center text-body">Submission not found</div>,
})

function SubmissionDetail() {
  const { submissionId } = Route.useParams()
  const sub = getSubmissionById(submissionId)
  const pushDummyToast = useUiStore((s) => s.pushDummyToast)
  const run = runs.find((r) => r.submissionId === submissionId)

  if (!sub) return null

  const steps = [
    { label: 'Queued', done: true, time: '14:20:00' },
    { label: 'Building', done: true, time: '14:20:05' },
    { label: 'Benchmarking', done: sub.status !== 'Queued', time: '14:20:10' },
    { label: 'Scoring', done: sub.status === 'Passed' || sub.status === 'Failed', time: '14:20:40' },
    { label: 'Complete', done: sub.status === 'Passed' || sub.status === 'Failed', time: '14:20:45' },
  ]

  return (
    <div>
      <Breadcrumb items={[{ label: 'Submissions', to: '/app/submissions' }, { label: sub.id }]} />
      <PageHeader
        title={`Submission ${sub.id}`}
        description={`${sub.challengeName} — ${sub.submittedAt}`}
        actions={
          sub.status === 'Passed' && (
            <Button variant="secondary" onClick={() => pushDummyToast('Replay launched')}>
              <Play className="size-4" /> Run Replay
            </Button>
          )
        }
      />

      <div className="flex items-center gap-2 mb-6">
        <span className={`text-sm font-medium ${submissionStatusColors[sub.status]}`}>{sub.status}</span>
        {sub.score && <span className="text-sm text-body">Score: {sub.score.toFixed(1)}</span>}
      </div>

      <Grid3>
        <StatsCard label="Status" value={sub.status} />
        <StatsCard label="Score" value={sub.score?.toFixed(1) ?? '—'} />
        <StatsCard label="Latency (P99)" value={sub.latency ? `${sub.latency}ms` : '—'} />
      </Grid3>

      <div className="mt-6">
        <DataCard title="Status Timeline" className="[&>h3]:text-on-dark">
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={s.label} className="flex items-start gap-3 py-2">
                <div className={`mt-1 size-2 rounded-full shrink-0 ${s.done ? 'bg-accent-green' : 'bg-surface-elevated'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <span className={`text-sm ${s.done ? 'text-on-dark' : 'text-mute'}`}>{s.label}</span>
                    {s.done && <span className="text-xs text-mute">{s.time}</span>}
                  </div>
                  {i < steps.length - 1 && <div className="ml-[3px] mt-0.5 w-px h-3 bg-hairline" />}
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      {run && (
        <div className="mt-6">
          <DataCard title="Benchmark Run" className="[&>h3]:text-on-dark">
            <Grid3>
              <StatsCard label="P99 Latency" value={`${run.p99LatencyMs}ms`} />
              <StatsCard label="Throughput" value={`${run.throughput.toLocaleString()} ops/s`} />
              <StatsCard label="Correctness" value={`${run.correctness}%`} deltaPositive={run.correctness > 95} />
            </Grid3>
            <Button asChild variant="ghost" size="sm" className="mt-4">
              <Link to="/app/runs/$runId" params={{ runId: run.id }}>View full run details</Link>
            </Button>
          </DataCard>
        </div>
      )}

      {run && (
        <div className="mt-6">
          <DataCard title="Run Events" className="[&>h3]:text-on-dark">
            <div className="space-y-1">
              {run.events.map((e, i) => (
                <div key={i} className="flex gap-3 text-sm py-1">
                  <span className="text-mute text-xs font-mono w-14 shrink-0">{e.time}</span>
                  <span className={`text-xs uppercase w-18 shrink-0 ${e.type === 'complete' ? 'text-accent-green' : e.type === 'phase' ? 'text-accent-blue' : 'text-mute'}`}>{e.type}</span>
                  <span className="text-body">{e.detail}</span>
                </div>
              ))}
            </div>
          </DataCard>
        </div>
      )}
    </div>
  )
}
