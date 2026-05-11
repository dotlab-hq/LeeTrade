import React, { useState } from 'react'
import { Plus, Trash2, Copy } from 'lucide-react'

export function OrganizerTrafficProfilesPage() {
  const [profiles] = useState([
    {
      id: 'profile-1',
      name: 'Light Load',
      description: 'Gentle ramping load for testing',
      phases: 1,
      maxQps: 1000,
      bots: 10,
    },
    {
      id: 'profile-2',
      name: 'Medium Load',
      description: 'Standard production-like load',
      phases: 3,
      maxQps: 5000,
      bots: 100,
    },
    {
      id: 'profile-3',
      name: 'Stress Test',
      description: 'Extreme load for performance benchmarking',
      phases: 5,
      maxQps: 50000,
      bots: 1000,
    },
  ])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">Traffic Profiles</h1>
          <p className="text-body">Define load generation patterns for benchmarks</p>
        </div>
        <button className="bg-primary hover:bg-primary-pressed text-on-primary font-medium px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          New Profile
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-surface border border-hairline rounded-lg p-6 hover:bg-surface-elevated transition-colors">
            <h3 className="text-lg font-bold text-ink mb-2">{profile.name}</h3>
            <p className="text-sm text-body mb-4">{profile.description}</p>

            <div className="space-y-3 mb-6 py-4 border-t border-b border-hairline">
              <div className="flex justify-between items-center text-sm">
                <span className="text-mute">Load Phases</span>
                <span className="font-medium text-ink">{profile.phases}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-mute">Max QPS</span>
                <span className="font-medium text-ink">{profile.maxQps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-mute">Bot Count</span>
                <span className="font-medium text-ink">{profile.bots}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-2 text-xs font-medium rounded border border-hairline hover:bg-surface-elevated transition-colors flex items-center justify-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Clone
              </button>
              <button
                className="flex-1 px-3 py-2 text-xs font-medium rounded border border-hairline hover:bg-accent-red-soft hover:text-accent-red hover:border-accent-red transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
