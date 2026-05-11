import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useChallenges, useCreateSubmission } from '#/hooks/api'
import { useAuthStore } from '#/lib/auth-store'
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react'

export function NewSubmissionPage() {
  const navigate = useNavigate()
  const { data: challenges = [], isLoading: challengesLoading } = useChallenges()
  const createSubmission = useCreateSubmission()
  const user = useAuthStore((s) => s.user)

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    challengeId: '',
    language: 'rust' as const,
    protocol: 'rest' as const,
  })

  const languages = [
    { id: 'rust', name: 'Rust' },
    { id: 'cpp', name: 'C++' },
    { id: 'go', name: 'Go' },
    { id: 'java', name: 'Java' },
    { id: 'python', name: 'Python' },
    { id: 'node', name: 'Node.js' },
  ]

  const protocols = [
    { id: 'rest', name: 'REST' },
    { id: 'websocket', name: 'WebSocket' },
    { id: 'fix', name: 'FIX' },
    { id: 'grpc', name: 'gRPC' },
  ]

  const handleSubmit = async () => {
    if (!formData.challengeId || !user) return

    try {
      const result = await createSubmission.mutateAsync({
        teamId: crypto.randomUUID(),
        challengeId: formData.challengeId,
        type: 'source',
        manifest: {
          version: '1',
          challengeKind: 'matching_engine',
          language: formData.language,
          protocol: formData.protocol,
          entrypoint: './server',
          runCommand: './run.sh',
          endpoints: [],
          resources: {
            cpuMillicores: 500,
            memoryMb: 256,
            ephemeralStorageMb: 512,
            timeoutSeconds: 300,
            startupTimeoutSeconds: 30,
            maxFileSizeMb: 50,
          },
        },
        submittedAt: new Date().toISOString(),
      })

      navigate({ to: `/app/submissions/${result?.id}` })
    } catch (err) {
      console.error('Failed to create submission:', err)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <button
        onClick={() => navigate({ to: '/app/submissions' })}
        className="flex items-center gap-2 text-body hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Submissions
      </button>

      <h1 className="text-3xl font-bold text-ink mb-2">Create New Submission</h1>
      <p className="text-body mb-8">Submit your solution to a challenge</p>

      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                s === step
                  ? 'bg-primary text-on-primary'
                  : s < step
                    ? 'bg-accent-green text-on-dark'
                    : 'bg-surface-elevated text-mute'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-0.5 transition-colors ${s < step ? 'bg-accent-green' : 'bg-hairline'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-surface border border-hairline rounded-lg p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-ink">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Submission Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Ultra-Low Latency Orderbook v2"
                className="w-full px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark placeholder-mute outline-none focus:border-hairline-strong transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Challenge</label>
              {challengesLoading ? (
                <p className="text-mute">Loading challenges...</p>
              ) : (
                <select
                  value={formData.challengeId}
                  onChange={(e) => setFormData({ ...formData, challengeId: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark outline-none focus:border-hairline-strong transition-colors"
                >
                  <option value="">Select a challenge</option>
                  {challenges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as typeof formData.language })}
                className="w-full px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark outline-none focus:border-hairline-strong transition-colors"
              >
                {languages.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Protocol</label>
              <select
                value={formData.protocol}
                onChange={(e) => setFormData({ ...formData, protocol: e.target.value as typeof formData.protocol })}
                className="w-full px-4 py-2 bg-surface-elevated border border-hairline rounded-md text-on-dark outline-none focus:border-hairline-strong transition-colors"
              >
                {protocols.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-ink">Upload Source Code</h2>

            <div className="border-2 border-dashed border-hairline rounded-lg p-12 text-center hover:border-hairline-strong transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-mute mx-auto mb-3" />
              <p className="text-sm font-medium text-ink mb-1">Drag and drop your file here</p>
              <p className="text-xs text-body">or click to browse (max 100MB)</p>
              <p className="text-xs text-mute mt-3">Supported: .zip, .tar.gz, Dockerfile</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-ink">Review Submission</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-hairline">
                <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-mute mb-1">Title</p>
                  <p className="text-sm font-medium text-ink">{formData.title || 'Untitled Submission'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-4 border-b border-hairline">
                <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-mute mb-1">Challenge</p>
                  <p className="text-sm font-medium text-ink">
                    {challenges.find((c) => c.id === formData.challengeId)?.title || 'Not selected'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-4 border-b border-hairline">
                <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-mute mb-1">Language</p>
                  <p className="text-sm font-medium text-ink">
                    {languages.find((l) => l.id === formData.language)?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pb-4 border-b border-hairline">
                <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-mute mb-1">Protocol</p>
                  <p className="text-sm font-medium text-ink uppercase">{formData.protocol}</p>
                </div>
              </div>

              <div className="bg-surface-elevated rounded p-4 mt-6">
                <p className="text-xs text-mute mb-2">Next Steps:</p>
                <ul className="space-y-1 text-xs text-body">
                  <li>• Your code will be validated and built</li>
                  <li>• Health checks will run to verify your service boots</li>
                  <li>• Benchmark runs will start automatically</li>
                  <li>• Results will appear in your submission detail page</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="px-6 py-2 bg-surface-elevated text-on-dark font-medium rounded-md border border-hairline hover:bg-surface-card disabled:opacity-50 transition-colors"
        >
          Previous
        </button>

        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 && (!formData.title || !formData.challengeId)}
            className="flex-1 px-6 py-2 bg-primary hover:bg-primary-pressed text-on-primary font-medium rounded-md disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={createSubmission.isPending}
            className="flex-1 px-6 py-2 bg-primary hover:bg-primary-pressed text-on-primary font-medium rounded-md disabled:opacity-50 transition-colors"
          >
            {createSubmission.isPending ? 'Submitting...' : 'Submit Submission'}
          </button>
        )}
      </div>
    </div>
  )
}