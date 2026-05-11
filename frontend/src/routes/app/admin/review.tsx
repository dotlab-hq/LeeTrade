import { createFileRoute } from '@tanstack/react-router'
import { AdminReviewQueuePage } from '#/components/pages/admin-review-queue-page'

export const Route = createFileRoute('/app/admin/review')({
  component: AdminReviewQueuePage,
})
