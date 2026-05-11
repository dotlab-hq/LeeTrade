import { createFileRoute } from '@tanstack/react-router'
import { trafficProfiles } from '@/lib/mock-data.ts'
import { PageHeader, Breadcrumb } from '@/components/ui/page-header.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUiStore } from '@/stores/ui-store.ts'
import { Plus, BarChart3 } from 'lucide-react'
import { requireRole } from '#/lib/route-guards'

export const Route = createFileRoute( '/app/organizer/traffic-profiles/' )( {
  beforeLoad: () => requireRole( ['admin', 'organizer'] ),
  component: TrafficProfiles,
} )

function TrafficProfiles() {
  const pushDummyToast = useUiStore( ( s ) => s.pushDummyToast )

  return (
    <div>
      <Breadcrumb items={[{ label: 'Organizer' }, { label: 'Traffic Profiles' }]} />
      <PageHeader
        title="Traffic Profiles"
        description="Load profile templates for benchmark scenarios."
        actions={<Button onClick={() => pushDummyToast( 'Profile creation started' )}><Plus className="size-4" /> New Profile</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trafficProfiles.map( ( p ) => (
          <div key={p.id} className="rounded-lg border border-hairline bg-surface p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-on-dark">{p.name}</h3>
                <p className="text-xs text-mute mt-0.5">{p.description}</p>
              </div>
              <BarChart3 className="size-5 text-mute" />
            </div>
            <div className="flex items-center gap-2 text-xs text-body">
              <span className="rounded-full bg-surface-elevated px-2 py-0.5">{p.type}</span>
              <span className="text-mute">{p.requestsPerSecond.toLocaleString()} req/s</span>
            </div>
            <Button variant="ghost" size="sm" className="mt-4" onClick={() => pushDummyToast( `Editing ${p.name}` )}>
              Edit Profile
            </Button>
          </div>
        ) )}
      </div>
    </div>
  )
}
