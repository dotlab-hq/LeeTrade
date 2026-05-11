import React, { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useSubmission, useSubmissionLogs, useSubmissionBuildLogs } from '#/hooks/api'
import { ArrowLeft, Play, Download, Trash2, RefreshCw } from 'lucide-react'

export function SubmissionDetailPage() {
  const { submissionId } = useParams({ from: '/app/submissions/$submissionId' })
  const navigate = useNavigate()
  const { data: submission, isLoading, error } = useSubmission(submissionId || '')
  const { data: logs } = useSubmissionLogs(submissionId || '')
  const { data: buildLogs } = useSubmissionBuildLogs(submissionId || '')
  const [activeTab, setActiveTab] = useState<'runs' | 'logs' | 'settings'>('runs')

  const statusColors: Record<string, string> = {
    uploaded: 'bg-surface-card text-mute',
    validating: 'bg-accent-blue-soft text-accent-blue',
    build_queued: 'bg-accent-blue-soft text-accent-blue',
    building: 'bg-accent-blue-soft text-accent-blue',
    build_failed: 'bg-accent-red-soft text-accent-red',
    deploying: 'bg-accent-yellow-soft text-accent-yellow',
    running: 'bg-accent-blue-soft text-accent-blue',
    ready: 'bg-accent-green-soft text-accent-green',
    testing: 'bg-accent-yellow-soft text-accent-yellow',
    completed: 'bg-accent-green-soft text-accent-green',
    failed: 'bg-accent-red-soft text-accent-red',
    invalid: 'bg-accent-red-soft text-accent-red',
  }

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute">Loading submission...</p>
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <button
          onClick={() => navigate({ to: '/app/submissions' })}
          className="flex items-center gap-2 text-body hover:text-ink mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Submissions
        </button>
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-accent-red mb-4">Failed to load submission</p>
          <button onClick={() => window.location.reload()} className="text-on-dark hover:text-ink font-medium">
            Retry
          </button>
        </div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold text-ink mb-2">{submission.manifest.challengeKind.replace('_', ' ')} Submission</h1>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[submission.status]}`}>
                {submission.status.replace('_', ' ')}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute uppercase">
                {submission.manifest.language}
              </span>
              <span className="text-xs px-2 py-1 rounded bg-surface-elevated text-body">
                {submission.type}
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

        <p className="text-body mb-4">Submission ID: {submission.id}</p>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-hairline">
          <div>
            <p className="text-xs text-mute mb-1">Submitted</p>
            <p className="text-sm font-medium text-ink">{new Date(submission.submittedAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Challenge</p>
            <button
              onClick={() => navigate({ to: `/challenges/${submission.challengeId}` })}
              className="text-sm font-medium text-on-dark hover:text-ink transition-colors"
            >
              {submission.challengeId.slice(0, 8)}...
            </button>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Team</p>
            <p className="text-sm font-medium text-ink">{submission.teamId.slice(0, 8)}...</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex border-b border-hairline">
          <button
            onClick={() => setActiveTab('runs')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'runs' ? 'text-on-dark border-on-dark' : 'text-mute hover:text-body border-transparent'
            }`}
          >
            Runs
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'logs' ? 'text-on-dark border-on-dark' : 'text-mute hover:text-body border-transparent'
            }`}
          >
            Logs
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'settings' ? 'text-on-dark border-on-dark' : 'text-mute hover:text-body border-transparent'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === 'runs' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ink">Benchmark Runs</h2>
            <button className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
              <Play className="w-4 h-4" />
              Start New Run
            </button>
          </div>

          <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
            <p className="text-mute mb-4">No runs yet</p>
            <p className="text-xs text-body">Submit the form above and start a run to see results here</p>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div>
          <h2 className="text-xl font-bold text-ink mb-6">Submission Logs</h2>
          {logs && logs.logs.length > 0 ? (
            <div className="bg-surface border border-hairline rounded-lg p-4 font-mono text-xs">
              {logs.logs.map((log, i) => (
                <div key={i} className="py-1 border-b border-hairline last:border-0">
                  <span className="text-mute">[{new Date(log.ts).toLocaleTimeString()}]</span>{' '}
                  <span className="text-body">{log.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
              <p className="text-mute">No logs available</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
          <h2 className="text-xl font-bold text-ink mb-6">Submission Settings</h2>
          <div className="bg-surface border border-hairline rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-mute mb-1">Manifest Version</p>
                <p className="text-sm font-medium text-ink">{submission.manifest.version}</p>
              </div>
              <div>
                <p className="text-xs text-mute mb-1">Protocol</p>
                <p className="text-sm font-medium text-ink uppercase">{submission.manifest.protocol}</p>
              </div>
              <div>
                <p className="text-xs text-mute mb-1">Entrypoint</p>
                <p className="text-sm font-medium text-ink">{submission.manifest.entrypoint}</p>
              </div>
              <div>
                <p className="text-xs text-mute mb-1">Run Command</p>
                <p className="text-sm font-medium text-ink">{submission.manifest.runCommand}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}