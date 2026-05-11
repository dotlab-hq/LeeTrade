import { createFileRoute } from '@tanstack/react-router'
import { OrganizerTrafficProfilesPage } from '#/components/pages/organizer-traffic-profiles-page'

export const Route = createFileRoute('/app/organizer/traffic-profiles')({
  component: OrganizerTrafficProfilesPage,
})
