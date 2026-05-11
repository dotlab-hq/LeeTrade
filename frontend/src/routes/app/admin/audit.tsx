import { createFileRoute } from '@tanstack/react-router'
import { AdminAuditLogPage } from '#/components/pages/admin-audit-log-page'
import { requireRole } from '#/lib/route-guards'

export const Route = createFileRoute( '/app/admin/audit' )( {
  beforeLoad: () => requireRole( ['admin'] ),
  component: AdminAuditLogPage,
} )
