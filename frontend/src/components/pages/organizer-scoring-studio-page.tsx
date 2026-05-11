import React, { useState } from 'react'
import { Save, RotateCcw } from 'lucide-react'

export function OrganizerScoringStudioPage() {
  const [weights, setWeights] = useState({
    latency: 40,
    throughput: 25,
    correctness: 25,
    stability: 10,
  })

  const [presets] = useState([
    { name: 'Balanced', latency: 40, throughput: 25, correctness: 25, stability: 10 },
    { name: 'Latency-Heavy', latency: 60, throughput: 15, correctness: 20, stability: 5 },
    { name: 'Correctness-First', latency: 20, throughput: 20, correctness: 50, stability: 10 },
  ])

  const total = weights.latency + weights.throughput + weights.correctness + weights.stability

  const handleWeightChange = (key: string, value: number) => {
    setWeights({ ...weights, [key]: Math.max(0, Math.min(100, value)) })
  }

  const handlePreset = (preset: any) => {
    setWeights({
      latency: preset.latency,
      throughput: preset.throughput,
      correctness: preset.correctness,
      stability: preset.stability,
    })
  }

  const handleReset = () => {
    setWeights({ latency: 40, throughput: 25, correctness: 25, stability: 10 })
  }

  const scoreBreakdown = {
    latency: (85 * weights.latency) / 100,
    throughput: (80 * weights.throughput) / 100,
    correctness: (95 * weights.correctness) / 100,
    stability: (90 * weights.stability) / 100,
  }

  const finalScore =
    scoreBreakdown.latency + scoreBreakdown.throughput + scoreBreakdown.correctness + scoreBreakdown.stability

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-ink mb-2">Scoring Studio</h1>
      <p className="text-body mb-8">Configure and preview scoring weights for challenges</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weights Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weight Sliders */}
          <div className="bg-surface border border-hairline rounded-lg p-6">
            <h2 className="text-lg font-bold text-ink mb-6">Scoring Weights</h2>

            {Object.entries(weights).map(([key, value]) => (
              <div key={key} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <label className="capitalize text-sm font-medium text-charcoal">{key}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 bg-surface-elevated border border-hairline rounded text-on-dark text-sm text-right outline-none focus:border-hairline-strong"
                    />
                    <span className="text-xs text-mute w-6">%</span>
                  </div>
                </div>

                <div className="relative h-2 bg-surface-elevated rounded overflow-hidden">
                  <div
                    className="h-full bg-accent-blue transition-all"
                    style={{
                      width: `${value}%`,
                      backgroundColor:
                        key === 'latency'
                          ? '#57c1ff'
                          : key === 'throughput'
                            ? '#59d499'
                            : key === 'correctness'
                              ? '#ffc533'
                              : '#ff6161',
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t border-hairline">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink">Total</p>
                <p className={`text-lg font-bold ${total === 100 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {total}%
                </p>
              </div>
              {total !== 100 && (
                <p className="text-xs text-accent-red mt-2">Weights must sum to 100%</p>
              )}
            </div>
          </div>

          {/* Presets */}
          <div className="bg-surface border border-hairline rounded-lg p-6">
            <h2 className="text-lg font-bold text-ink mb-4">Quick Presets</h2>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePreset(preset)}
                  className="text-left p-3 rounded border border-hairline hover:bg-surface-elevated transition-colors"
                >
                  <p className="font-medium text-ink mb-1">{preset.name}</p>
                  <div className="flex gap-3 text-xs text-mute">
                    <span>L: {preset.latency}%</span>
                    <span>T: {preset.throughput}%</span>
                    <span>C: {preset.correctness}%</span>
                    <span>S: {preset.stability}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {/* Score Breakdown Card */}
          <div className="bg-surface border border-hairline rounded-lg p-6">
            <h2 className="text-lg font-bold text-ink mb-4">Score Breakdown</h2>
            <p className="text-xs text-mute mb-4">Example calculation with mock scores</p>

            <div className="space-y-3 mb-6">
              {[
                { label: 'Latency', score: 85, contribution: scoreBreakdown.latency, color: 'text-accent-blue' },
                {
                  label: 'Throughput',
                  score: 80,
                  contribution: scoreBreakdown.throughput,
                  color: 'text-accent-green',
                },
                {
                  label: 'Correctness',
                  score: 95,
                  contribution: scoreBreakdown.correctness,
                  color: 'text-accent-yellow',
                },
                {
                  label: 'Stability',
                  score: 90,
                  contribution: scoreBreakdown.stability,
                  color: 'text-accent-red',
                },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-body">{metric.label}</span>
                    <span className={`font-medium ${metric.color}`}>
                      {metric.score.toFixed(0)} × {weights[metric.label.toLowerCase() as any]}% ={' '}
                      {metric.contribution.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-surface-elevated rounded overflow-hidden">
                    <div
                      className="h-full bg-accent-blue transition-all"
                      style={{
                        width: `${Math.min(100, (metric.contribution / 100) * 100)}%`,
                        backgroundColor: metric.color.replace('text-', '').includes('blue')
                          ? '#57c1ff'
                          : metric.color.includes('green')
                            ? '#59d499'
                            : metric.color.includes('yellow')
                              ? '#ffc533'
                              : '#ff6161',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface-elevated rounded p-4 border border-hairline">
              <p className="text-xs text-mute mb-1">Final Score</p>
              <p className="text-3xl font-bold text-ink">{finalScore.toFixed(1)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 px-3 py-2 bg-surface-elevated hover:bg-surface-card text-on-dark font-medium rounded border border-hairline transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              disabled={total !== 100}
              className="flex-1 px-3 py-2 bg-primary hover:bg-primary-pressed disabled:opacity-50 text-on-primary font-medium rounded transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
