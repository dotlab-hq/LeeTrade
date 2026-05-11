import React, { useMemo } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Download, Zap } from 'lucide-react'

export function RunDetailPage() {
  const { runId } = useParams({ from: '/app/runs/$runId' })
  const navigate = useNavigate()

  // Mock run data
  const run = {
    id: runId,
    submissionId: 'sub-1',
    challengeId: 'challenge-1',
    status: 'completed' as const,
    startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    totalRequests: 150000,
    succeededRequests: 149850,
    failedRequests: 150,
    latencyP50: 12.5,
    latencyP90: 45.3,
    latencyP99: 125.7,
    throughputPeak: 15000,
    throughputSustained: 12500,
    correctnessScore: 98.5,
    stabilityScore: 95.2,
    finalScore: 96.8,
  }

  const metrics = [
    {
      title: 'Latency Percentiles',
      items: [
        { label: 'P50', value: `${run.latencyP50.toFixed(2)}ms` },
        { label: 'P90', value: `${run.latencyP90.toFixed(2)}ms` },
        { label: 'P99', value: `${run.latencyP99.toFixed(2)}ms` },
      ],
    },
    {
      title: 'Throughput',
      items: [
        { label: 'Peak', value: `${run.throughputPeak.toLocaleString()} ops/s` },
        { label: 'Sustained', value: `${run.throughputSustained.toLocaleString()} ops/s` },
      ],
    },
    {
      title: 'Correctness',
      items: [
        { label: 'Score', value: `${run.correctnessScore.toFixed(1)}%` },
        { label: 'Success Rate', value: `${((run.succeededRequests / run.totalRequests) * 100).toFixed(2)}%` },
      ],
    },
  ]

  const events = [
    { timestamp: new Date(run.startedAt), event: 'Run started' },
    { timestamp: new Date(run.startedAt.getTime() + 30 * 1000), event: 'Warmup phase completed' },
    { timestamp: new Date(run.startedAt.getTime() + 5 * 60 * 1000), event: 'Load generation phase 1 completed' },
    { timestamp: new Date(run.startedAt.getTime() + 10 * 60 * 1000), event: 'Load generation phase 2 completed' },
    { timestamp: run.completedAt!, event: 'Run completed' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: `/app/submissions/${run.submissionId}` })}
        className="flex items-center gap-2 text-body hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Submission
      </button>

      {/* Header */}
      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">Benchmark Run</h1>
            <p className="text-body">{run.id}</p>
          </div>
          <span
            className={`px-3 py-1 rounded font-medium text-sm ${
              run.status === 'completed'
                ? 'bg-accent-green-soft text-accent-green'
                : run.status === 'failed'
                  ? 'bg-accent-red-soft text-accent-red'
                  : 'bg-accent-blue-soft text-accent-blue'
            }`}
          >
            {run.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-hairline">
          <div>
            <p className="text-xs text-mute mb-1">Started At</p>
            <p className="text-sm font-medium text-ink">{run.startedAt.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Duration</p>
            <p className="text-sm font-medium text-ink">
              {((run.completedAt!.getTime() - run.startedAt.getTime()) / 1000).toFixed(1)}s
            </p>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Final Score</p>
            <p className="text-2xl font-bold text-ink">{run.finalScore.toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-4">Performance Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-elevated rounded p-4">
            <p className="text-xs text-mute mb-2">Final Score</p>
            <p className="text-3xl font-bold text-ink">{run.finalScore.toFixed(1)}</p>
          </div>
          <div className="bg-surface-elevated rounded p-4">
            <p className="text-xs text-mute mb-2">Latency Score</p>
            <p className="text-3xl font-bold text-accent-blue">85.0</p>
          </div>
          <div className="bg-surface-elevated rounded p-4">
            <p className="text-xs text-mute mb-2">Correctness</p>
            <p className="text-3xl font-bold text-accent-green">{run.correctnessScore.toFixed(1)}</p>
          </div>
          <div className="bg-surface-elevated rounded p-4">
            <p className="text-xs text-mute mb-2">Stability</p>
            <p className="text-3xl font-bold text-accent-yellow">{run.stabilityScore.toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-surface border border-hairline rounded-lg p-6">
            <h3 className="text-lg font-bold text-ink mb-4">{metric.title}</h3>
            <div className="space-y-3">
              {metric.items.map((item, j) => (
                <div key={j} className="flex items-center justify-between py-2 border-b border-hairline last:border-0">
                  <span className="text-sm text-body">{item.label}</span>
                  <span className="text-sm font-medium text-ink">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Request Statistics */}
      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-4">Request Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-mute mb-2">Total Requests</p>
            <p className="text-2xl font-bold text-ink">{run.totalRequests.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-mute mb-2">Succeeded</p>
            <p className="text-2xl font-bold text-accent-green">{run.succeededRequests.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-mute mb-2">Failed</p>
            <p className="text-2xl font-bold text-accent-red">{run.failedRequests.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-mute mb-2">Success Rate</p>
            <p className="text-2xl font-bold text-accent-green">
              {((run.succeededRequests / run.totalRequests) * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-6">Event Timeline</h2>
        <div className="space-y-4">
          {events.map((event, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-accent-blue mt-2" />
                {i < events.length - 1 && <div className="w-0.5 h-12 bg-hairline" />}
              </div>
              <div className="pb-4">
                <p className="text-xs text-mute">{event.timestamp.toLocaleTimeString()}</p>
                <p className="text-sm font-medium text-ink">{event.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" />
          Export Results
        </button>
        <button className="bg-surface-elevated hover:bg-surface-card text-on-dark font-medium px-4 py-2 rounded-md border border-hairline transition-colors flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Replay Run
        </button>
      </div>
    </div>
  )
}
