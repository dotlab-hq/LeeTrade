import { createFileRoute } from '@tanstack/react-router'
import { OrganizerTrafficProfilesPage } from '#/components/pages/organizer-traffic-profiles-page'
import { requireRole } from '#/lib/route-guards'

export const Route = createFileRoute( '/app/organizer/traffic-profiles' )( {
  beforeLoad: () => requireRole( ['admin', 'organizer'] ),
  component: OrganizerTrafficProfilesPage,
} )
