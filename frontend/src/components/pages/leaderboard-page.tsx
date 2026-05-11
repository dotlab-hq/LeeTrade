import React, { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { generateMockLeaderboard, generateMockChallenges } from '#/lib/mock-data'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function GlobalLeaderboardPage() {
  const navigate = useNavigate()
  const challenges = useMemo(() => generateMockChallenges(5), [])
  const [selectedChallenge, setSelectedChallenge] = useState(challenges[0]?.id || '')

  const leaderboard = useMemo(
    () => generateMockLeaderboard(selectedChallenge, 20),
    [selectedChallenge]
  )

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ink mb-2">Global Leaderboard</h1>
        <p className="text-body">See how you rank against other participants</p>
      </div>

      {/* Challenge Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-charcoal mb-3">Select Challenge:</label>
        <select
          value={selectedChallenge}
          onChange={(e) => setSelectedChallenge(e.target.value)}
          className="w-full md:w-64 px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark outline-none focus:border-hairline-strong transition-colors"
        >
          {challenges.map((challenge) => (
            <option key={challenge.id} value={challenge.id}>
              {challenge.title}
            </option>
          ))}
        </select>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-surface border border-hairline rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-hairline bg-surface-elevated">
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Team
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">
                Score
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">
                Latency
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">
                Throughput
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">
                Correctness
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {leaderboard.map((entry, i) => (
              <tr
                key={entry.submissionId}
                className="hover:bg-surface-elevated transition-colors cursor-pointer"
                onClick={() => navigate({ to: `/app/submissions/${entry.submissionId}` })}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-ink">#{entry.rank}</span>
                    {i < 3 && (
                      <span className="text-lg">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-ink">{entry.teamName}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="font-bold text-ink text-lg">{entry.score.toFixed(1)}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="text-sm text-body">{entry.latencyScore.toFixed(1)}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="text-sm text-body">{entry.throughputScore.toFixed(1)}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <p className="text-sm text-accent-green font-medium">{entry.correctnessScore.toFixed(1)}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      entry.status === 'final'
                        ? 'bg-accent-green-soft text-accent-green'
                        : entry.status === 'live'
                          ? 'bg-accent-blue-soft text-accent-blue'
                          : 'bg-surface-card text-mute'
                    }`}
                  >
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
