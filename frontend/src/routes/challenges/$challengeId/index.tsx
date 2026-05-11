import { createFileRoute } from '@tanstack/react-router'
import { ChallengeDetailPage } from '#/components/pages/challenge-detail-page'

export const Route = createFileRoute('/challenges/$challengeId/')({
  component: ChallengeDetailPage,
})
