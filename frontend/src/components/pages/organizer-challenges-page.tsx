import React, { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { generateMockChallenges } from '#/lib/mock-data'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

export function OrganizerChallengesPage() {
  const navigate = useNavigate()
  const challenges = useMemo(() => generateMockChallenges(6), [])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredChallenges = challenges.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">Manage Challenges</h1>
          <p className="text-body">Create and configure competition challenges</p>
        </div>
        <button className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          New Challenge
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search challenges..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark placeholder-mute outline-none focus:border-hairline-strong transition-colors"
        />
      </div>

      {/* Challenges Table */}
      <div className="bg-surface border border-hairline rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-hairline bg-surface-elevated">
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {filteredChallenges.map((challenge) => (
              <tr key={challenge.id} className="hover:bg-surface-elevated transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-ink">{challenge.title}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute">
                    {challenge.kind}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-body">{challenge.participants}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-body">{challenge.createdAt.toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      title="View"
                      className="p-2 hover:bg-surface-elevated rounded transition-colors text-mute hover:text-on-dark"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      title="Edit"
                      className="p-2 hover:bg-surface-elevated rounded transition-colors text-mute hover:text-on-dark"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      title="Delete"
                      className="p-2 hover:bg-accent-red-soft rounded transition-colors text-mute hover:text-accent-red"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
