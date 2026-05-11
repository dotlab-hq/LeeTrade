import React, { useMemo } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { generateMockRuns } from '#/lib/mock-data'
import { ArrowLeft, Play, Download, Trash2 } from 'lucide-react'

export function SubmissionDetailPage() {
  const { submissionId } = useParams({ from: '/app/submissions/$submissionId' })
  const navigate = useNavigate()
  const runs = useMemo(() => generateMockRuns(submissionId || 'sub-1', 5), [submissionId])

  // Mock submission data
  const submission = {
    id: submissionId,
    title: 'High-Performance Orderbook',
    challengeId: 'challenge-1',
    status: 'completed',
    language: 'rust',
    description: 'An optimized orderbook implementation using SIMD and lockfree data structures.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    version: '1.2.3',
  }

  const statusColors = {
    draft: 'bg-surface-card text-mute',
    building: 'bg-accent-blue-soft text-accent-blue',
    ready: 'bg-accent-green-soft text-accent-green',
    testing: 'bg-accent-yellow-soft text-accent-yellow',
    completed: 'bg-accent-green-soft text-accent-green',
    failed: 'bg-accent-red-soft text-accent-red',
  }

  const runStatusColors = {
    queued: 'bg-surface-card text-mute',
    starting: 'bg-accent-blue-soft text-accent-blue',
    running: 'bg-accent-blue-soft text-accent-blue',
    completed: 'bg-accent-green-soft text-accent-green',
    failed: 'bg-accent-red-soft text-accent-red',
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: '/app/submissions' })}
        className="flex items-center gap-2 text-body hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Submissions
      </button>

      {/* Header Section */}
      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-ink mb-2">{submission.title}</h1>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-2 py-1 rounded font-medium ${
                  statusColors[submission.status as keyof typeof statusColors]
                }`}
              >
                {submission.status}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute">
                {submission.language}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-surface-elevated text-body">
                v{submission.version}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-surface-elevated rounded-md transition-colors text-mute hover:text-on-dark">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-accent-red-soft hover:text-accent-red rounded-md transition-colors text-mute">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <p className="text-body mb-4">{submission.description}</p>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-hairline">
          <div>
            <p className="text-xs text-mute mb-1">Created</p>
            <p className="text-sm font-medium text-ink">{submission.createdAt.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Last Updated</p>
            <p className="text-sm font-medium text-ink">{submission.updatedAt.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Challenge</p>
            <button
              onClick={() => navigate({ to: `/challenges/${submission.challengeId}` })}
              className="text-sm font-medium text-on-dark hover:text-ink transition-colors"
            >
              {submission.challengeId}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-hairline">
          <button className="px-4 py-3 font-medium text-on-dark border-b-2 border-on-dark">
            Runs
          </button>
          <button className="px-4 py-3 font-medium text-mute hover:text-body">
            Logs
          </button>
          <button className="px-4 py-3 font-medium text-mute hover:text-body">
            Settings
          </button>
        </div>
      </div>

      {/* Runs Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-ink">Benchmark Runs</h2>
          <button className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
            <Play className="w-4 h-4" />
            Start New Run
          </button>
        </div>

        <div className="space-y-3">
          {runs.map((run) => (
            <div
              key={run.id}
              onClick={() => navigate({ to: `/app/runs/${run.id}` })}
              className="bg-surface border border-hairline rounded-lg p-4 hover:bg-surface-elevated cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-ink mb-2">Run #{run.id.split('-').pop()}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      runStatusColors[run.status as keyof typeof runStatusColors]
                    }`}
                  >
                    {run.status}
                  </span>
                </div>
                <p className="text-xs text-mute">{run.startedAt.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-3 border-t border-hairline">
                <div>
                  <p className="text-xs text-mute mb-1">P50 Latency</p>
                  <p className="text-sm font-medium text-ink">{run.latencyP50.toFixed(2)}ms</p>
                </div>
                <div>
                  <p className="text-xs text-mute mb-1">P99 Latency</p>
                  <p className="text-sm font-medium text-ink">{run.latencyP99.toFixed(2)}ms</p>
                </div>
                <div>
                  <p className="text-xs text-mute mb-1">Throughput</p>
                  <p className="text-sm font-medium text-ink">{run.throughputSustained.toFixed(0)} ops/s</p>
                </div>
                <div>
                  <p className="text-xs text-mute mb-1">Correctness</p>
                  <p className="text-sm font-medium text-accent-green">{run.correctnessScore.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-mute mb-1">Final Score</p>
                  <p className="text-sm font-bold text-ink">{run.finalScore.toFixed(1)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
