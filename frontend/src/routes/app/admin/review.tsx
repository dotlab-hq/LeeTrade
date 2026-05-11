import { createFileRoute } from '@tanstack/react-router'
import { AdminReviewQueuePage } from '#/components/pages/admin-review-queue-page'
import { requireRole } from '#/lib/route-guards'

export const Route = createFileRoute( '/app/admin/review' )( {
  beforeLoad: () => requireRole( ['admin'] ),
  component: AdminReviewQueuePage,
} )
