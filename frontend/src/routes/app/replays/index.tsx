import { createFileRoute, Link } from '@tanstack/react-router'
import { replays } from '@/lib/mock-data.ts'
import { PageHeader } from '@/components/ui/page-header.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUiStore } from '@/stores/ui-store.ts'
import { Play, Plus, Tags, Clock } from 'lucide-react'

export const Route = createFileRoute('/app/replays/')({ component: ReplayCenter })

function ReplayCenter() {
  const pushDummyToast = useUiStore((s) => s.pushDummyToast)

  return (
    <div>
      <PageHeader
        title="Replay Center"
        description="Saved traffic replay presets for benchmarking."
        actions={<Button onClick={() => pushDummyToast('Replay preset created')}><Plus className="size-4" /> New Preset</Button>}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {replays.map((rp) => (
          <div key={rp.id} className="rounded-lg border border-hairline bg-surface p-5 hover:bg-surface-elevated transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-on-dark">{rp.name}</h3>
              <Button variant="ghost" size="icon-xs" onClick={() => pushDummyToast(`Replaying ${rp.name}`)}>
                <Play className="size-3" />
              </Button>
            </div>
            <p className="text-xs text-mute mb-3">Profile: {rp.trafficProfile}</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {rp.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-surface-elevated px-2 py-0.5 text-xs text-body">
                  <Tags className="size-3" /> {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-mute">
              <Clock className="size-3" /> Created {rp.createdAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
