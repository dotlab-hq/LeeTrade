import React from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useRunTelemetry } from '#/hooks/api'
import { ArrowLeft, Download, Zap, RefreshCw } from 'lucide-react'

export function RunDetailPage() {
  const { runId } = useParams({ from: '/app/runs/$runId' })
  const navigate = useNavigate()
  const { data: telemetry, isLoading, error } = useRunTelemetry(runId || '')

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate({ to: '/app/submissions' })}
          className="flex items-center gap-2 text-body hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute">Loading telemetry...</p>
        </div>
      </div>
    )
  }

  if (error || !telemetry) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate({ to: '/app/submissions' })}
          className="flex items-center gap-2 text-body hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-accent-red mb-4">Failed to load telemetry</p>
          <button onClick={() => window.location.reload()} className="text-on-dark hover:text-ink font-medium">
            Retry
          </button>
        </div>
      </div>
    )
  }

  const metrics = telemetry.metrics as Record<string, number> | undefined

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <button
        onClick={() => navigate({ to: '/app/submissions' })}
        className="flex items-center gap-2 text-body hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Submissions
      </button>

      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">Benchmark Run</h1>
            <p className="text-body">{runId}</p>
          </div>
          <span className="px-3 py-1 rounded font-medium text-sm bg-accent-blue-soft text-accent-blue">
            Running
          </span>
        </div>
      </div>

      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-4">Performance Metrics</h2>
        {metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="bg-surface-elevated rounded p-4">
                <p className="text-xs text-mute mb-2 capitalize">{key.replace(/_/g, ' ')}</p>
                <p className="text-2xl font-bold text-ink">{typeof value === 'number' ? value.toFixed(2) : value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-mute">No metrics available yet</p>
        )}
      </div>

      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-6">Event Timeline</h2>
        {telemetry.events && telemetry.events.length > 0 ? (
          <div className="space-y-4">
            {telemetry.events.map((event, i) => (
              <div key={event.eventId} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-accent-blue mt-2" />
                  {i < telemetry.events.length - 1 && <div className="w-0.5 h-12 bg-hairline" />}
                </div>
                <div className="pb-4">
                  <p className="text-xs text-mute">{new Date(event.ts).toLocaleTimeString()}</p>
                  <p className="text-sm font-medium text-ink">{event.type.replace(/_/g, ' ')}</p>
                  {event.message && <p className="text-xs text-body mt-1">{event.message}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-mute">No events recorded yet</p>
        )}
      </div>

      <div className="flex gap-4">
        <button className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" />
          Export Results
        </button>
      </div>
    </div>
  )
}