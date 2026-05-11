import React, { useState } from 'react'
import { useChallenges, useCreateChallenge, usePublishChallenge } from '#/hooks/api'
import { Plus, Edit, Trash2, Eye, Globe, Lock } from 'lucide-react'

export function OrganizerChallengesPage() {
  const { data: challenges = [], isLoading, error, refetch } = useChallenges()
  const createChallenge = useCreateChallenge()
  const publishChallenge = usePublishChallenge()
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredChallenges = challenges.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePublish = async (id: string) => {
    try {
      await publishChallenge.mutateAsync(id)
      refetch()
    } catch (e) {
      console.error('Failed to publish:', e)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">Manage Challenges</h1>
          <p className="text-body">Create and configure competition challenges</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Challenge
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search challenges..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark placeholder-mute outline-none focus:border-hairline-strong transition-colors"
        />
      </div>

      {isLoading ? (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute">Loading challenges...</p>
        </div>
      ) : error ? (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-accent-red mb-4">Failed to load challenges</p>
          <button onClick={() => refetch()} className="text-on-dark hover:text-ink font-medium">
            Retry
          </button>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute mb-4">No challenges found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md transition-colors"
          >
            Create First Challenge
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-hairline rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline bg-surface-elevated">
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredChallenges.map((challenge) => (
                <tr key={challenge.id} className="hover:bg-surface-elevated transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">{challenge.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute capitalize">
                      {challenge.kind.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      challenge.published ? 'bg-accent-green-soft text-accent-green' : 'bg-surface-card text-mute'
                    }`}>
                      {challenge.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        title="View"
                        className="p-2 hover:bg-surface-elevated rounded transition-colors text-mute hover:text-on-dark"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!challenge.published && (
                        <button
                          onClick={() => handlePublish(challenge.id)}
                          title="Publish"
                          className="p-2 hover:bg-accent-green-soft rounded transition-colors text-mute hover:text-accent-green"
                        >
                          <Globe className="w-4 h-4" />
                        </button>
                      )}
                      <button title="Edit" className="p-2 hover:bg-surface-elevated rounded transition-colors text-mute hover:text-on-dark">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button title="Delete" className="p-2 hover:bg-accent-red-soft rounded transition-colors text-mute hover:text-accent-red">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}