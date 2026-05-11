import { createFileRoute } from '@tanstack/react-router'
import { SubmissionDetailPage } from '#/components/pages/submission-detail-page'

export const Route = createFileRoute('/app/submissions/$submissionId')({
  component: SubmissionDetailPage,
})
