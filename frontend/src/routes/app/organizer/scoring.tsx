import { createFileRoute } from '@tanstack/react-router'
import { OrganizerScoringStudioPage } from '#/components/pages/organizer-scoring-studio-page'

export const Route = createFileRoute('/app/organizer/scoring')({
  component: OrganizerScoringStudioPage,
})
