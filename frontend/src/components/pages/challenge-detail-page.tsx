import React from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useChallenge, useLeaderboard } from '#/hooks/api'
import { ArrowLeft, Play } from 'lucide-react'

export function ChallengeDetailPage() {
  const { challengeId } = useParams({ from: '/challenges/$challengeId' })
  const navigate = useNavigate()
  const { data: challenge, isLoading, error } = useChallenge(challengeId || '')
  const { data: leaderboard } = useLeaderboard(challengeId || '')

  const kindBadgeColors: Record<string, string> = {
    orderbook: 'bg-accent-blue-soft text-accent-blue',
    matching_engine: 'bg-accent-green-soft text-accent-green',
    risk_engine: 'bg-accent-red-soft text-accent-red',
    router: 'bg-accent-yellow-soft text-accent-yellow',
    custom: 'bg-surface-card text-mute',
  }

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button onClick={() => navigate({ to: '/challenges' })} className="flex items-center gap-2 text-body hover:text-ink mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Challenges
        </button>
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute">Loading challenge...</p>
        </div>
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button onClick={() => navigate({ to: '/challenges' })} className="flex items-center gap-2 text-body hover:text-ink mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Challenges
        </button>
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-accent-red mb-4">Failed to load challenge</p>
          <button onClick={() => window.location.reload()} className="text-on-dark hover:text-ink font-medium">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={() => navigate({ to: '/challenges' })} className="flex items-center gap-2 text-body hover:text-ink mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Challenges
      </button>

      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-ink mb-4">{challenge.title}</h1>
        <p className="text-body mb-4">Challenge ID: {challenge.id}</p>

        <div className="flex items-center gap-4 py-4 border-y border-hairline">
          <div>
            <p className="text-xs text-mute mb-1">Type</p>
            <span className={`text-xs px-2 py-1 rounded font-medium ${kindBadgeColors[challenge.kind]}`}>
              {challenge.kind.replace('_', ' ')}
            </span>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Protocol</p>
            <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute uppercase">{challenge.protocol}</span>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Participants</p>
            <p className="text-sm font-medium text-ink">{leaderboard?.entries.length || 0}</p>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Status</p>
            <span className={`text-xs px-2 py-1 rounded font-medium ${
              challenge.published ? 'bg-accent-green-soft text-accent-green' : 'bg-surface-card text-mute'
            }`}>
              {challenge.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-4">Scoring Model</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-elevated rounded p-3">
            <p className="text-xs text-mute mb-2">Latency</p>
            <p className="text-2xl font-bold text-accent-blue">40%</p>
          </div>
          <div className="bg-surface-elevated rounded p-3">
            <p className="text-xs text-mute mb-2">Throughput</p>
            <p className="text-2xl font-bold text-accent-green">25%</p>
          </div>
          <div className="bg-surface-elevated rounded p-3">
            <p className="text-xs text-mute mb-2">Correctness</p>
            <p className="text-2xl font-bold text-accent-yellow">25%</p>
          </div>
          <div className="bg-surface-elevated rounded p-3">
            <p className="text-xs text-mute mb-2">Stability</p>
            <p className="text-2xl font-bold text-accent-red">10%</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate({ to: '/app/submissions/new' })}
          className="flex-1 bg-primary hover:bg-primary-pressed text-on-primary font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Play className="w-4 h-4" />
          Submit Solution
        </button>
        <button
          onClick={() => navigate({ to: '/leaderboard' })}
          className="flex-1 bg-surface-elevated hover:bg-surface-card text-on-dark font-medium py-3 rounded-md border border-hairline transition-colors"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  )
}