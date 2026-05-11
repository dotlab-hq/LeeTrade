import React, { useMemo, useState } from 'react'
import { Eye, Download } from 'lucide-react'

interface AuditEntry {
  id: string
  timestamp: Date
  action: string
  actor: string
  target: string
  severity: 'info' | 'warning' | 'error'
  details: string
}

export function AdminAuditLogPage() {
  const [filter, setFilter] = useState<'all' | 'warning' | 'error'>('all')

  const auditLog: AuditEntry[] = useMemo(
    () => [
      {
        id: 'audit-1',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        action: 'SUBMISSION_APPROVED',
        actor: 'admin@leetrade.com',
        target: 'sub-1',
        severity: 'info',
        details: 'Submission approved after review',
      },
      {
        id: 'audit-2',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        action: 'SUBMISSION_REJECTED',
        actor: 'admin@leetrade.com',
        target: 'sub-5',
        severity: 'warning',
        details: 'Code contains prohibited patterns',
      },
      {
        id: 'audit-3',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        action: 'RUN_INVALIDATED',
        actor: 'admin@leetrade.com',
        target: 'run-3',
        severity: 'error',
        details: 'Contract violation detected',
      },
      {
        id: 'audit-4',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        action: 'USER_FLAGGED',
        actor: 'system',
        target: 'user-42',
        severity: 'warning',
        details: 'Suspicious activity detected: 100 submissions in 1 hour',
      },
      {
        id: 'audit-5',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        action: 'CHALLENGE_UPDATED',
        actor: 'organizer@leetrade.com',
        target: 'challenge-1',
        severity: 'info',
        details: 'Scoring weights updated',
      },
    ],
    []
  )

  const filteredLog = auditLog.filter((entry) => {
    if (filter === 'all') return true
    return entry.severity === filter
  })

  const severityColors = {
    info: 'bg-accent-blue-soft text-accent-blue',
    warning: 'bg-accent-yellow-soft text-accent-yellow',
    error: 'bg-accent-red-soft text-accent-red',
  }

  const actionTypeColors = {
    SUBMISSION_APPROVED: 'text-accent-green',
    SUBMISSION_REJECTED: 'text-accent-red',
    RUN_INVALIDATED: 'text-accent-red',
    USER_FLAGGED: 'text-accent-yellow',
    CHALLENGE_UPDATED: 'text-accent-blue',
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-ink mb-2">Audit Log</h1>
      <p className="text-body mb-8">Monitor all platform actions and changes</p>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded border transition-colors ${
            filter === 'all'
              ? 'bg-surface-elevated border-hairline-strong text-on-dark'
              : 'border-hairline text-body hover:bg-surface-elevated'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={`px-4 py-2 rounded border transition-colors ${
            filter === 'warning'
              ? 'bg-accent-yellow-soft border-accent-yellow text-accent-yellow'
              : 'border-hairline text-body hover:bg-surface-elevated'
          }`}
        >
          Warnings
        </button>
        <button
          onClick={() => setFilter('error')}
          className={`px-4 py-2 rounded border transition-colors ${
            filter === 'error'
              ? 'bg-accent-red-soft border-accent-red text-accent-red'
              : 'border-hairline text-body hover:bg-surface-elevated'
          }`}
        >
          Errors
        </button>
      </div>

      {/* Audit Table */}
      <div className="bg-surface border border-hairline rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-hairline bg-surface-elevated">
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Actor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Target
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Severity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {filteredLog.map((entry) => (
              <tr key={entry.id} className="hover:bg-surface-elevated transition-colors">
                <td className="px-6 py-4 text-sm text-body">{entry.timestamp.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <p
                    className={`text-sm font-medium ${
                      actionTypeColors[entry.action as keyof typeof actionTypeColors] || 'text-ink'
                    }`}
                  >
                    {entry.action.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-mute mt-1">{entry.details}</p>
                </td>
                <td className="px-6 py-4 text-sm text-body">{entry.actor}</td>
                <td className="px-6 py-4 text-sm font-mono text-mute">{entry.target}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium capitalize ${
                      severityColors[entry.severity]
                    }`}
                  >
                    {entry.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    title="View details"
                    className="p-2 hover:bg-surface-elevated rounded transition-colors text-mute hover:text-on-dark"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export */}
      <div className="mt-6 flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 bg-surface-elevated hover:bg-surface-card text-on-dark font-medium rounded border border-hairline transition-colors">
          <Download className="w-4 h-4" />
          Export Log
        </button>
      </div>
    </div>
  )
}
