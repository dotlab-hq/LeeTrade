import React, { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { generateMockSubmissions } from '#/lib/mock-data'
import { Plus, Search, Filter } from 'lucide-react'

export function SubmissionsListPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const submissions = useMemo(() => generateMockSubmissions(12), [])

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = sub.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const statusColors = {
    draft: 'bg-surface-card text-mute',
    building: 'bg-accent-blue-soft text-accent-blue',
    ready: 'bg-accent-green-soft text-accent-green',
    testing: 'bg-accent-yellow-soft text-accent-yellow',
    completed: 'bg-accent-green-soft text-accent-green',
    failed: 'bg-accent-red-soft text-accent-red',
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-ink mb-2">Submissions</h1>
            <p className="text-body">Manage and track your submissions</p>
          </div>
          <button
            onClick={() => navigate({ to: '/app/submissions/new' })}
            className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Submission
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-mute pointer-events-none" />
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark placeholder-mute outline-none focus:border-hairline-strong transition-colors"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark outline-none focus:border-hairline-strong transition-colors flex items-center gap-2"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="building">Building</option>
            <option value="ready">Ready</option>
            <option value="testing">Testing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-sm text-mute">
          Showing {filteredSubmissions.length} of {submissions.length} submissions
        </p>
      </div>

      {/* Submissions Table */}
      {filteredSubmissions.length > 0 ? (
        <div className="space-y-3">
          {filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              onClick={() => navigate({ to: `/app/submissions/${submission.id}` })}
              className="bg-surface border border-hairline rounded-lg p-4 hover:bg-surface-elevated cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-ink mb-2">{submission.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute">
                          {submission.language}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            statusColors[submission.status as keyof typeof statusColors]
                          }`}
                        >
                          {submission.status}
                        </span>
                        {submission.challengeId && (
                          <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute">
                            {submission.challengeId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-6">
                  <div className="flex flex-col items-end gap-2">
                    {submission.score !== undefined && (
                      <div>
                        <p className="text-2xl font-bold text-ink">{submission.score.toFixed(1)}</p>
                        <p className="text-xs text-mute">Score</p>
                      </div>
                    )}
                    <p className="text-xs text-mute">
                      {new Date(submission.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute mb-4">No submissions found</p>
          <button
            onClick={() => navigate({ to: '/app/submissions/new' })}
            className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md transition-colors"
          >
            Create Your First Submission
          </button>
        </div>
      )}
    </div>
  )
}
