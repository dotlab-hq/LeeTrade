import { createFileRoute } from '@tanstack/react-router'
import { OrganizerChallengesPage } from '#/components/pages/organizer-challenges-page'

export const Route = createFileRoute('/app/organizer/challenges')({
  component: OrganizerChallengesPage,
})
