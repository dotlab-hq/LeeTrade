import { createFileRoute } from '@tanstack/react-router'
import { AdminAuditLogPage } from '#/components/pages/admin-audit-log-page'

export const Route = createFileRoute('/app/admin/audit')({
  component: AdminAuditLogPage,
})
