import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useChallenges } from '#/hooks/api'
import { TopNav } from '@/components/ui/app-shell.tsx'
import Footer from '@/components/ui/footer'
import { Search, Users } from 'lucide-react'

export function ChallengesPage() {
  const navigate = useNavigate()
  const { data: challenges = [], isLoading, error } = useChallenges()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterKind, setFilterKind] = useState<string>('all')

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesKind = filterKind === 'all' || challenge.kind === filterKind
    return matchesSearch && matchesKind
  })

  const kindBadgeColors: Record<string, string> = {
    orderbook: 'bg-accent-blue-soft text-accent-blue',
    matching_engine: 'bg-accent-green-soft text-accent-green',
    risk_engine: 'bg-accent-red-soft text-accent-red',
    router: 'bg-accent-yellow-soft text-accent-yellow',
    custom: 'bg-surface-card text-mute',
  }

  return (
    <div className="min-h-screen bg-canvas">
      <TopNav />
      <main className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ink mb-2">Challenges</h1>
        <p className="text-body">Explore and participate in competitive benchmarking challenges</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-mute pointer-events-none" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark placeholder-mute outline-none focus:border-hairline-strong transition-colors"
          />
        </div>

        <select
        title='types'
          value={filterKind}
          onChange={(e) => setFilterKind(e.target.value)}
          className="px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark outline-none focus:border-hairline-strong transition-colors"
        >
          <option value="all">All Types</option>
          <option value="orderbook">Orderbook</option>
          <option value="matching_engine">Matching Engine</option>
          <option value="risk_engine">Risk Engine</option>
          <option value="router">Router</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="mb-6">
        <p className="text-sm text-mute">
          Showing {filteredChallenges.length} of {challenges.length} challenges
        </p>
      </div>

      {isLoading ? (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute">Loading challenges...</p>
        </div>
      ) : error ? (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-accent-red mb-4">Failed to load challenges</p>
          <button onClick={() => window.location.reload()} className="text-on-dark hover:text-ink font-medium text-sm">
            Retry
          </button>
        </div>
      ) : filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => navigate({ to: `/challenges/${challenge.id}` })}
              className="bg-surface border border-hairline rounded-lg p-6 hover:bg-surface-elevated cursor-pointer transition-colors flex flex-col"
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-ink mb-2">{challenge.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-1 rounded font-medium ${kindBadgeColors[challenge.kind] || kindBadgeColors.custom}`}>
                    {challenge.kind.replace('_', ' ')}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-surface-card text-mute capitalize">{challenge.protocol}</span>
                </div>
              </div>
              <p className="text-sm text-body mb-4 flex-1 line-clamp-3">Challenge: {challenge.title}</p>
              <div className="flex items-center justify-between pt-4 border-t border-hairline">
                <div className="flex items-center gap-1 text-mute">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Active</span>
                </div>
                <button className="text-on-dark hover:text-ink font-medium text-sm transition-colors">
                  View details →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute mb-4">No challenges found</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterKind('all')
            }}
            className="text-on-dark hover:text-ink font-medium text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
      </main>
      <Footer />
    </div>
  )
}