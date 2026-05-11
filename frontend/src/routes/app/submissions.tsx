import { createFileRoute } from '@tanstack/react-router'
import { SubmissionsListPage } from '#/components/pages/submissions-list-page'

export const Route = createFileRoute('/app/submissions')({
  component: SubmissionsListPage,
})
