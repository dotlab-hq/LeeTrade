import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/ui/page-header.tsx'
import { DataCard } from '@/components/ui/data-cards.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUiStore } from '@/stores/ui-store.ts'
import { User } from 'lucide-react'

export const Route = createFileRoute('/app/profile/')({ component: Profile })

function Profile() {
  const pushDummyToast = useUiStore((s) => s.pushDummyToast)

  return (
    <div>
      <PageHeader title="Profile" description="Manage your account and preferences." />

      <div className="grid gap-6 md:grid-cols-2">
        <DataCard title="Account" className="[&>h3]:text-on-dark">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-full bg-surface-elevated flex items-center justify-center">
              <User className="size-6 text-mute" />
            </div>
            <div>
              <p className="text-sm font-medium text-on-dark">Contestant User</p>
              <p className="text-xs text-mute">contestant@leetrade.io</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Display Name</Label>
              <Input className="mt-1" defaultValue="Contestant User" />
            </div>
            <div>
              <Label>Email</Label>
              <Input className="mt-1" defaultValue="contestant@leetrade.io" />
            </div>
            <Button onClick={() => pushDummyToast('Profile updated')}>Save Changes</Button>
          </div>
        </DataCard>

        <DataCard title="Preferences" className="[&>h3]:text-on-dark">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-on-dark">Email Notifications</p>
                <p className="text-xs text-mute">Receive updates about submissions</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => pushDummyToast('Notifications toggled')}>Enabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-on-dark">Keyboard Shortcuts</p>
                <p className="text-xs text-mute">Ctrl+K to open command palette</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => pushDummyToast('Shortcuts toggled')}>Enabled</Button>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  )
}
