import React, { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '#/lib/auth-store'
import { generateMockSubmissions, generateMockChallenges } from '#/lib/mock-data'
import { TrendingUp, FileText, Trophy, Plus } from 'lucide-react'

interface StatsCard {
  label: string
  value: string | number
  icon: React.ReactNode
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const submissions = useMemo(() => generateMockSubmissions(5), [])
  const challenges = useMemo(() => generateMockChallenges(4), [])

  const stats: StatsCard[] = [
    {
      label: 'Total Submissions',
      value: submissions.length,
      icon: <FileText className="w-5 h-5 text-accent-blue" />,
    },
    {
      label: 'Completed',
      value: submissions.filter((s) => s.status === 'completed').length,
      icon: <TrendingUp className="w-5 h-5 text-accent-green" />,
    },
    {
      label: 'Available Challenges',
      value: challenges.length,
      icon: <Trophy className="w-5 h-5 text-accent-yellow" />,
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ink mb-2">Dashboard</h1>
        <p className="text-body">Welcome back, {user?.name}! Here's your activity overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-surface border border-hairline rounded-lg p-6 hover:bg-surface-elevated transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-mute mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-ink">{stat.value}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Submissions */}
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

        <div className="space-y-3">
          {submissions.slice(0, 5).map((submission) => (
            <div
              key={submission.id}
              onClick={() => navigate({ to: `/app/submissions/${submission.id}` })}
              className="bg-surface border border-hairline rounded-lg p-4 hover:bg-surface-elevated cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-ink">{submission.title}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute">
                      {submission.language}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        submission.status === 'completed'
                          ? 'bg-accent-green-soft text-accent-green'
                          : submission.status === 'failed'
                            ? 'bg-accent-red-soft text-accent-red'
                            : 'bg-accent-blue-soft text-accent-blue'
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                </div>
                {submission.score !== undefined && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-ink">{submission.score.toFixed(1)}</p>
                    <p className="text-xs text-mute">Score</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Challenges */}
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
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      challenge.difficulty === 'easy'
                        ? 'bg-accent-green-soft text-accent-green'
                        : challenge.difficulty === 'hard'
                          ? 'bg-accent-red-soft text-accent-red'
                          : 'bg-accent-yellow-soft text-accent-yellow'
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-xs text-mute mb-3">{challenge.description.slice(0, 80)}...</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-body">{challenge.participants} participants</span>
                <span className="text-xs text-body capitalize">{challenge.kind}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
