import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '#/lib/auth-store'
import { useChallenges } from '#/hooks/api'
import { useLeaderboard } from '#/hooks/api'
import { TrendingUp, FileText, Trophy, Plus } from 'lucide-react'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: challenges = [], isLoading: challengesLoading } = useChallenges()
  const [challengeId, setChallengeId] = React.useState<string>('')

  React.useEffect(() => {
    if (challenges.length > 0 && !challengeId) {
      setChallengeId(challenges[0].id)
    }
  }, [challenges, challengeId])

  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(challengeId)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ink mb-2">Dashboard</h1>
        <p className="text-body">Welcome back, {user?.name}! Here's your activity overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface border border-hairline rounded-lg p-6 hover:bg-surface-elevated transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-mute mb-2">Total Submissions</p>
              <p className="text-3xl font-bold text-ink">{leaderboard?.entries.length || 0}</p>
            </div>
            <FileText className="w-5 h-5 text-accent-blue" />
          </div>
        </div>
        <div className="bg-surface border border-hairline rounded-lg p-6 hover:bg-surface-elevated transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-mute mb-2">Completed</p>
              <p className="text-3xl font-bold text-ink">
                {leaderboard?.entries.filter((e) => e.status === 'final').length || 0}
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-accent-green" />
          </div>
        </div>
        <div className="bg-surface border border-hairline rounded-lg p-6 hover:bg-surface-elevated transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-mute mb-2">Available Challenges</p>
              <p className="text-3xl font-bold text-ink">{challenges.length}</p>
            </div>
            <Trophy className="w-5 h-5 text-accent-yellow" />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-ink">Recent Submissions</h2>
            <p className="text-sm text-body">Your latest submission activity</p>
          </div>
          <button
            onClick={() => navigate({ to: '/app/submissions/new' })}
            className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Submission
          </button>
        </div>

        {leaderboardLoading ? (
          <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
            <p className="text-mute">Loading submissions...</p>
          </div>
        ) : leaderboard?.entries.length === 0 ? (
          <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
            <p className="text-mute mb-4">No submissions yet</p>
            <button
              onClick={() => navigate({ to: '/app/submissions/new' })}
              className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md transition-colors"
            >
              Create Your First Submission
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard?.entries.slice(0, 5).map((entry) => (
              <div
                key={entry.submissionId}
                onClick={() => navigate({ to: `/app/submissions/${entry.submissionId}` })}
                className="bg-surface border border-hairline rounded-lg p-4 hover:bg-surface-elevated cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-ink">Team Submission</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute">source</span>
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
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-ink">{entry.score.toFixed(1)}</p>
                    <p className="text-xs text-mute">Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-ink">Active Challenges</h2>
            <p className="text-sm text-body">Compete and improve your ranking</p>
          </div>
          <button
            onClick={() => navigate({ to: '/challenges' })}
            className="text-on-dark hover:text-ink font-medium text-sm"
          >
            View all →
          </button>
        </div>

        {challengesLoading ? (
          <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
            <p className="text-mute">Loading challenges...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.slice(0, 4).map((challenge) => (
              <div
                key={challenge.id}
                onClick={() => navigate({ to: `/challenges/${challenge.id}` })}
                className="bg-surface border border-hairline rounded-lg p-4 hover:bg-surface-elevated cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-ink mb-1">{challenge.title}</h3>
                    <span className="text-xs px-2 py-1 rounded font-medium bg-accent-blue-soft text-accent-blue capitalize">
                      {challenge.kind.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-mute mb-3">Challenge ID: {challenge.id.slice(0, 8)}...</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-body">Active</span>
                  <span className="text-xs text-body">{challenge.protocol}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}