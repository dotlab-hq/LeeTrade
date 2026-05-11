import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { challenges } from '@/lib/mock-data.ts'
import { PageHeader, Breadcrumb } from '@/components/ui/page-header.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { useUiStore } from '@/stores/ui-store.ts'

export const Route = createFileRoute('/app/submissions/new')({ component: NewSubmission })

function NewSubmission() {
  const [step, setStep] = useState(1)
  const [challengeId, setChallengeId] = useState('')
  const [notes, setNotes] = useState('')
  const pushDummyToast = useUiStore((s) => s.pushDummyToast)
  const navigate = useNavigate()

  const handleSubmit = () => {
    pushDummyToast('Submission created')
    navigate({ to: '/app/submissions' })
  }

  return (
    <div>
      <Breadcrumb items={[{ label: 'Submissions', to: '/app/submissions' }, { label: 'New Submission' }]} />
      <PageHeader title="New Submission" description="Submit your solution for benchmarking." />

      <div className="flex gap-2 mb-8">
        {['Select Challenge', 'Upload Artifact', 'Review & Confirm'].map((label, i) => (
          <div key={label} className={`flex-1 rounded-md border p-3 text-center ${step === i + 1 ? 'border-hairline-strong bg-surface-elevated' : 'border-hairline bg-surface'}`}>
            <span className={`text-xs font-medium ${step === i + 1 ? 'text-on-dark' : 'text-mute'}`}>
              Step {i + 1}
            </span>
            <p className="text-sm text-body mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="rounded-lg border border-hairline bg-surface p-6 max-w-lg">
          <Label>Challenge</Label>
          <Select value={challengeId} onValueChange={setChallengeId}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue placeholder="Select a challenge..." />
            </SelectTrigger>
            <SelectContent>
              {challenges.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name} — {c.difficulty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="mt-6" disabled={!challengeId} onClick={() => setStep(2)}>Next</Button>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-lg border border-hairline bg-surface p-6 max-w-lg">
          <Label>Build Artifact (ZIP/TAR)</Label>
          <div className="mt-1.5 rounded-md border border-dashed border-hairline-strong bg-canvas p-8 text-center cursor-pointer hover:bg-surface-elevated transition-colors">
            <p className="text-sm text-mute">Drop your artifact here or click to browse</p>
            <p className="text-xs text-ash mt-1">ZIP or TAR archives up to 50MB</p>
          </div>
          <div className="mt-4">
            <Label>Notes (optional)</Label>
            <Input className="mt-1.5" placeholder="Any notes about this submission..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-lg border border-hairline bg-surface p-6 max-w-lg">
          <h3 className="text-sm font-medium text-on-dark mb-4">Review Your Submission</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-body">Challenge</span><span className="text-on-dark">{challenges.find((c) => c.id === challengeId)?.name || challengeId}</span></div>
            <div className="flex justify-between"><span className="text-body">Artifact</span><span className="text-on-dark">solution.zip</span></div>
            <div className="flex justify-between"><span className="text-body">Notes</span><span className="text-on-dark">{notes || '—'}</span></div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handleSubmit}>Submit for Benchmarking</Button>
          </div>
        </div>
      )}
    </div>
  )
}
