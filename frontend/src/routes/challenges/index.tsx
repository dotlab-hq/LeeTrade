import { createFileRoute } from '@tanstack/react-router'
import { ChallengesPage } from '#/components/pages/challenges-page'

export const Route = createFileRoute('/challenges/')({
  component: ChallengesPage,
})
