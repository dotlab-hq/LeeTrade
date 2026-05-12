import React, { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useChallenges, useLeaderboard } from '#/hooks/api'
import { TopNav } from '@/components/ui/app-shell.tsx'
import Footer from '@/components/ui/footer'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { StaggerMotionWrapper } from '@/components/ui/motion-wrapper'

export function GlobalLeaderboardPage() {
  const navigate = useNavigate()
  const { data: challenges = [], isLoading: challengesLoading } = useChallenges()
  const [selectedChallenge, setSelectedChallenge] = useState( '' )
  const prefersReducedMotion = useReducedMotion()

  useEffect( () => {
    if ( challenges.length > 0 && !selectedChallenge ) {
      setSelectedChallenge( challenges[0].id )
    }
  }, [challenges, selectedChallenge] )

  const { data: leaderboard, isLoading: leaderboardLoading, error } = useLeaderboard( selectedChallenge )

  return (
    <div className="min-h-screen bg-canvas">
      <TopNav />
      <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ink mb-2">Global Leaderboard</h1>
        <p className="text-body">See how you rank against other participants</p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-charcoal mb-3">Select Challenge:</label>
        {challengesLoading ? (
          <p className="text-mute">Loading challenges...</p>
        ) : (
          <select
            value={selectedChallenge}
            onChange={( e ) => setSelectedChallenge( e.target.value )}
            className="w-full md:w-64 px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark outline-none focus:border-hairline-strong transition-colors"
          >
            {challenges.map( ( challenge ) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.title}
              </option>
            ) )}
          </select>
        )}
      </div>

      {leaderboardLoading ? (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute">Loading leaderboard...</p>
        </div>
      ) : error ? (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-accent-red mb-4">Failed to load leaderboard</p>
          <button onClick={() => window.location.reload()} className="text-on-dark hover:text-ink font-medium text-sm">
            Retry
          </button>
        </div>
      ) : !leaderboard || leaderboard.entries.length === 0 ? (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute">No entries yet</p>
        </div>
      ) : (
        <div className="bg-surface border border-hairline rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline bg-surface-elevated">
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">Team</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">Score</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">Latency</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">Throughput</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">Correctness</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {leaderboard.entries.map( ( entry, i ) => (
                <tr
                  key={entry.submissionId}
                  className="group relative cursor-pointer"
                  onClick={() => navigate( { to: `/app/submissions/${entry.submissionId}` } )}
                  style={{
                    transition: prefersReducedMotion
                      ? 'none'
                      : 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: !prefersReducedMotion 
                      ? `list-item-enter 300ms cubic-bezier(0.4, 0, 0.2, 1) forwards`
                      : 'none',
                    animationDelay: !prefersReducedMotion ? `${i * 50}ms` : '0ms',
                  }}
                  onMouseEnter={(e) => {
                    if (!prefersReducedMotion) {
                      const el = e.currentTarget as HTMLElement
                      el.style.backgroundColor = 'rgba(16, 17, 17, 0.6)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!prefersReducedMotion) {
                      const el = e.currentTarget as HTMLElement
                      el.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span 
                        className="text-lg font-bold text-ink"
                        style={{
                          animation: !prefersReducedMotion && i < 3
                            ? `rank-bump 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
                            : 'none',
                          transformOrigin: 'center',
                        }}
                      >
                        #{entry.rank}
                      </span>
                      {i < 3 && (
                        <span 
                          className="text-lg"
                          style={{
                            animation: !prefersReducedMotion
                              ? `achievement-pop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
                              : 'none',
                            animationDelay: !prefersReducedMotion ? '100ms' : '0ms',
                          }}
                        >
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">Team {entry.teamId.slice( 0, 8 )}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p 
                      className="font-bold text-ink text-lg"
                      style={{
                        animation: !prefersReducedMotion
                          ? `score-up 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`
                          : 'none',
                        animationDelay: !prefersReducedMotion ? '150ms' : '0ms',
                      }}
                    >
                      {( entry.score ?? 0 ).toFixed( 1 )}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm text-body">{( entry.latencyScore ?? 0 ).toFixed( 1 )}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm text-body">{( entry.throughputScore ?? 0 ).toFixed( 1 )}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-sm text-accent-green font-medium">{( entry.correctnessScore ?? 0 ).toFixed( 1 )}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium transition-all ${entry.status === 'final'
                          ? 'bg-accent-green-soft text-accent-green'
                          : entry.status === 'live'
                            ? 'bg-accent-blue-soft text-accent-blue'
                            : 'bg-surface-card text-mute'
                        }`}
                      style={{
                        transition: prefersReducedMotion
                          ? 'none'
                          : 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ) )}
            </tbody>
          </table>
        </div>
      )}
      </main>
      <Footer />
    </div>
  )
}
