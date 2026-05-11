import { createFileRoute } from '@tanstack/react-router'
import { GlobalLeaderboardPage } from '#/components/pages/leaderboard-page'

export const Route = createFileRoute('/leaderboard/')({
  component: GlobalLeaderboardPage,
})
