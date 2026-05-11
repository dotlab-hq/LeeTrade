import React, { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { generateMockChallenges } from '#/lib/mock-data'
import { Search, Users } from 'lucide-react'

export function ChallengesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const challenges = useMemo(() => generateMockChallenges(12), [])

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = filterDifficulty === 'all' || challenge.difficulty === filterDifficulty
    return matchesSearch && matchesDifficulty
  })

  const difficultyColors = {
    easy: 'bg-accent-green-soft text-accent-green',
    medium: 'bg-accent-yellow-soft text-accent-yellow',
    hard: 'bg-accent-red-soft text-accent-red',
  }

  const kindBadgeColors = {
    orderbook: 'bg-accent-blue-soft text-accent-blue',
    matching_engine: 'bg-accent-green-soft text-accent-green',
    risk_engine: 'bg-accent-red-soft text-accent-red',
    router: 'bg-accent-yellow-soft text-accent-yellow',
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ink mb-2">Challenges</h1>
        <p className="text-body">Explore and participate in competitive benchmarking challenges</p>
      </div>

      {/* Search and Filter Bar */}
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
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark outline-none focus:border-hairline-strong transition-colors"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-sm text-mute">
          Showing {filteredChallenges.length} of {challenges.length} challenges
        </p>
      </div>

      {/* Challenges Grid */}
      {filteredChallenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => navigate({ to: `/challenges/${challenge.id}` })}
              className="bg-surface border border-hairline rounded-lg p-6 hover:bg-surface-elevated cursor-pointer transition-colors flex flex-col"
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-ink mb-2">{challenge.title}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      difficultyColors[challenge.difficulty as keyof typeof difficultyColors]
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      kindBadgeColors[challenge.kind as keyof typeof kindBadgeColors]
                    }`}
                  >
                    {challenge.kind.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-body mb-4 flex-1 line-clamp-3">{challenge.description}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-hairline">
                <div className="flex items-center gap-1 text-mute">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">{challenge.participants} participants</span>
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
              setFilterDifficulty('all')
            }}
            className="text-on-dark hover:text-ink font-medium text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
