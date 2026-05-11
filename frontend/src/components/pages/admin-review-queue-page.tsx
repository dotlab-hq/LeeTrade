import React, { useState } from 'react'
import { generateMockSubmissions } from '#/lib/mock-data'
import { Check, X, AlertCircle } from 'lucide-react'

export function AdminReviewQueuePage() {
  const submissions = generateMockSubmissions(8).filter((s) => s.status !== 'draft')
  const [selected, setSelected] = useState<string | null>(null)

  const selectedSubmission = submissions.find((s) => s.id === selected)

  const handleApprove = () => {
    alert('Submission approved!')
    setSelected(null)
  }

  const handleReject = () => {
    alert('Submission rejected!')
    setSelected(null)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-ink mb-2">Review Queue</h1>
      <p className="text-body mb-8">Review and moderate submission artifacts</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-hairline rounded-lg overflow-hidden">
            <div className="bg-surface-elevated px-6 py-3 border-b border-hairline">
              <p className="font-medium text-charcoal">Pending Submissions ({submissions.length})</p>
            </div>

            <div className="divide-y divide-hairline max-h-96 overflow-y-auto">
              {submissions.map((submission) => (
                <button
                  key={submission.id}
                  onClick={() => setSelected(submission.id)}
                  className={`w-full text-left px-6 py-4 hover:bg-surface-elevated transition-colors ${
                    selected === submission.id ? 'bg-surface-elevated' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-ink mb-1">{submission.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute">
                          {submission.language}
                        </span>
                        <span className="text-xs text-mute">{submission.id}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          submission.status === 'failed'
                            ? 'bg-accent-red-soft text-accent-red'
                            : 'bg-accent-blue-soft text-accent-blue'
                        }`}
                      >
                        {submission.status}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div>
          {selectedSubmission ? (
            <div className="bg-surface border border-hairline rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-bold text-ink mb-4">Submission Details</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-mute mb-1">Title</p>
                  <p className="text-sm font-medium text-ink">{selectedSubmission.title}</p>
                </div>
                <div>
                  <p className="text-xs text-mute mb-1">Language</p>
                  <p className="text-sm font-medium text-ink capitalize">{selectedSubmission.language}</p>
                </div>
                <div>
                  <p className="text-xs text-mute mb-1">Status</p>
                  <p className="text-sm font-medium text-ink capitalize">{selectedSubmission.status}</p>
                </div>
                <div>
                  <p className="text-xs text-mute mb-1">Created</p>
                  <p className="text-sm font-medium text-ink">{selectedSubmission.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-accent-red-soft border border-accent-red rounded p-4 mb-6">
                <div className="flex gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-accent-red flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-accent-red mb-1">Flags</p>
                    <ul className="text-xs text-accent-red space-y-1">
                      <li>• Large binary size (45MB)</li>
                      <li>• Contains external dependencies</li>
                      <li>• Previous version rejected</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  className="flex-1 px-3 py-2 bg-accent-green hover:bg-green-600 text-on-dark font-medium rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 px-3 py-2 bg-accent-red hover:bg-red-600 text-on-dark font-medium rounded flex items-center justify-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface border border-hairline rounded-lg p-6 text-center">
              <p className="text-mute">Select a submission to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
