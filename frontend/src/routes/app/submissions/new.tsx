import { createFileRoute } from '@tanstack/react-router'
import { NewSubmissionPage } from '#/components/pages/new-submission-page'

export const Route = createFileRoute('/app/submissions/new')({
  component: NewSubmissionPage,
})
