import { createFileRoute } from '@tanstack/react-router'
import { challenges } from '@/lib/mock-data.ts'
import { PageHeader, Breadcrumb } from '@/components/ui/page-header.tsx'
import { DataCard } from '@/components/ui/data-cards.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUiStore } from '@/stores/ui-store.ts'
import { Slider } from '@/components/ui/slider.tsx'
import { useState } from 'react'
import { requireRole } from '#/lib/route-guards'

export const Route = createFileRoute( '/app/organizer/scoring/' )( {
  beforeLoad: () => requireRole( ['admin', 'organizer'] ),
  component: ScoringStudio,
} )

function ScoringStudio() {
  const pushDummyToast = useUiStore( ( s ) => s.pushDummyToast )
  const challenge = challenges[0]

  return (
    <div>
      <Breadcrumb items={[{ label: 'Organizer' }, { label: 'Scoring Studio' }]} />
      <PageHeader title="Scoring Studio" description="Adjust scoring weights and simulate results." />

      <div className="grid gap-6 md:grid-cols-2">
        <DataCard title={`${challenge.name} — Weights`} className="[&>h3]:text-on-dark">
          <div className="space-y-6">
            {challenge.scoringWeights.map( ( w ) => (
              <div key={w.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-body">{w.name}</span>
                  <span className="text-sm text-on-dark">{( w.weight * 100 ).toFixed( 0 )}%</span>
                </div>
                <Slider defaultValue={[w.weight * 100]} max={100} step={5} />
                <p className="text-xs text-mute mt-1">{w.description}</p>
              </div>
            ) )}
          </div>
          <Button className="mt-6" onClick={() => pushDummyToast( 'Weights saved' )}>Save Weights</Button>
        </DataCard>

        <div className="space-y-6">
          <DataCard title="Simulation Preview" className="[&>h3]:text-on-dark">
            <div className="space-y-3">
              {challenge.scoringWeights.map( ( w ) => (
                <div key={w.name} className="flex justify-between text-sm">
                  <span className="text-body">{w.name}</span>
                  <span className="text-on-dark">{( Math.random() * 100 ).toFixed( 1 )}</span>
                </div>
              ) )}
              <div className="border-t border-hairline pt-2 flex justify-between text-sm font-medium">
                <span className="text-on-dark">Composite Score</span>
                <span className="text-accent-green">{( 80 + Math.random() * 15 ).toFixed( 1 )}</span>
              </div>
            </div>
            <Button variant="secondary" className="mt-4 w-full" onClick={() => pushDummyToast( 'Simulation refreshed' )}>
              Refresh Simulation
            </Button>
          </DataCard>

          <DataCard title="Saved Presets" className="[&>h3]:text-on-dark">
            <div className="space-y-2 text-sm">
              {['Default', 'Latency-Focused', 'Throughput-Optimized'].map( ( preset ) => (
                <div key={preset} className="flex items-center justify-between py-1">
                  <span className="text-body">{preset}</span>
                  <Button variant="ghost" size="xs" onClick={() => pushDummyToast( `Loaded ${preset}` )}>Load</Button>
                </div>
              ) )}
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  )
}
