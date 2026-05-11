import { createFileRoute } from '@tanstack/react-router'
import { OrganizerScoringStudioPage } from '#/components/pages/organizer-scoring-studio-page'
import { requireRole } from '#/lib/route-guards'

export const Route = createFileRoute( '/app/organizer/scoring' )( {
  beforeLoad: () => requireRole( ['admin', 'organizer'] ),
  component: OrganizerScoringStudioPage,
} )
