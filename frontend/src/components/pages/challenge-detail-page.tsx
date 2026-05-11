import React, { useMemo } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Play } from 'lucide-react'

export function ChallengeDetailPage() {
  const { challengeId } = useParams({ from: '/challenges/$challengeId' })
  const navigate = useNavigate()

  // Mock challenge data
  const challenge = {
    id: challengeId,
    title: 'Ultra-Low Latency Orderbook',
    description:
      'Build an orderbook implementation optimized for sub-microsecond latencies while maintaining strict correctness guarantees under high-frequency trading patterns.',
    kind: 'orderbook' as const,
    difficulty: 'hard' as const,
    participants: 127,
    createdAt: new Date('2024-01-15'),
    rules: [
      'Submissions must handle 10,000+ orders per second',
      'Price-time priority must be strictly maintained',
      'All cancellations must be acknowledged within 100µs',
      'No data races or undefined behavior allowed',
    ],
    contract: {
      endpoints: [
        { method: 'GET', path: '/health', description: 'Health check' },
        { method: 'GET', path: '/ready', description: 'Readiness probe' },
        { method: 'POST', path: '/order', description: 'Submit order' },
        { method: 'POST', path: '/cancel', description: 'Cancel order' },
        { method: 'GET', path: '/book', description: 'Get order book' },
      ],
    },
    scoring: {
      latency: 40,
      throughput: 25,
      correctness: 25,
      stability: 10,
    },
    resources: {
      cpuMillicores: 2000,
      memoryMb: 2048,
      timeoutSeconds: 300,
    },
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: '/challenges' })}
        className="flex items-center gap-2 text-body hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Challenges
      </button>

      {/* Header Section */}
      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-ink mb-4">{challenge.title}</h1>
        <p className="text-body mb-4">{challenge.description}</p>

        <div className="flex items-center gap-4 py-4 border-y border-hairline">
          <div>
            <p className="text-xs text-mute mb-1">Difficulty</p>
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                challenge.difficulty === 'hard'
                  ? 'bg-accent-red-soft text-accent-red'
                  : challenge.difficulty === 'medium'
                    ? 'bg-accent-yellow-soft text-accent-yellow'
                    : 'bg-accent-green-soft text-accent-green'
              }`}
            >
              {challenge.difficulty}
            </span>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Type</p>
            <span className="text-xs px-2 py-1 rounded bg-accent-blue-soft text-accent-blue font-medium">
              {challenge.kind}
            </span>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Participants</p>
            <p className="text-sm font-medium text-ink">{challenge.participants}</p>
          </div>
        </div>
      </div>

      {/* Scoring Model */}
      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-4">Scoring Model</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-elevated rounded p-3">
            <p className="text-xs text-mute mb-2">Latency</p>
            <p className="text-2xl font-bold text-accent-blue">{challenge.scoring.latency}%</p>
          </div>
          <div className="bg-surface-elevated rounded p-3">
            <p className="text-xs text-mute mb-2">Throughput</p>
            <p className="text-2xl font-bold text-accent-green">{challenge.scoring.throughput}%</p>
          </div>
          <div className="bg-surface-elevated rounded p-3">
            <p className="text-xs text-mute mb-2">Correctness</p>
            <p className="text-2xl font-bold text-accent-yellow">{challenge.scoring.correctness}%</p>
          </div>
          <div className="bg-surface-elevated rounded p-3">
            <p className="text-xs text-mute mb-2">Stability</p>
            <p className="text-2xl font-bold text-accent-red">{challenge.scoring.stability}%</p>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-4">Rules & Requirements</h2>
        <ul className="space-y-2">
          {challenge.rules.map((rule, i) => (
            <li key={i} className="flex gap-3 text-sm text-body">
              <span className="text-accent-green font-bold">✓</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contract */}
      <div className="bg-surface border border-hairline rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-ink mb-4">Runtime Contract</h2>
        <div className="space-y-2">
          {challenge.contract.endpoints.map((ep, i) => (
            <div key={i} className="bg-surface-elevated p-3 rounded border border-hairline">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-accent-blue mb-1">
                    {ep.method} {ep.path}
                  </p>
                  <p className="text-xs text-mute">{ep.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-surface border border-hairline rounded-lg p-6 mb-8">
        <h2 className="text-lg font-bold text-ink mb-4">Resource Limits</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-mute mb-1">CPU Cores</p>
            <p className="text-sm font-medium text-ink">{challenge.resources.cpuMillicores / 1000}</p>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Memory</p>
            <p className="text-sm font-medium text-ink">{challenge.resources.memoryMb}MB</p>
          </div>
          <div>
            <p className="text-xs text-mute mb-1">Timeout</p>
            <p className="text-sm font-medium text-ink">{challenge.resources.timeoutSeconds}s</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate({ to: '/app/submissions/new' })}
          className="flex-1 bg-primary hover:bg-primary-pressed text-on-primary font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Play className="w-4 h-4" />
          Submit Solution
        </button>
        <button
          onClick={() => navigate({ to: `/leaderboard/${challenge.id}` })}
          className="flex-1 bg-surface-elevated hover:bg-surface-card text-on-dark font-medium py-3 rounded-md border border-hairline transition-colors"
        >
          View Leaderboard
        </button>
      </div>
    </div>
  )
}
