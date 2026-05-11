import { createFileRoute } from '@tanstack/react-router'
import { RunDetailPage } from '#/components/pages/run-detail-page'

export const Route = createFileRoute('/app/runs/$runId')({
  component: RunDetailPage,
})
