import { createFileRoute } from '@tanstack/react-router'
import { OrganizerChallengesPage } from '#/components/pages/organizer-challenges-page'
import { requireRole } from '#/lib/route-guards'

export const Route = createFileRoute( '/app/organizer/challenges' )( {
  beforeLoad: () => requireRole( ['admin', 'organizer'] ),
  component: OrganizerChallengesPage,
} )
