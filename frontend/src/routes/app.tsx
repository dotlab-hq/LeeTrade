import { createFileRoute } from '@tanstack/react-router'
import { AppShell } from '#/components/layout/app-shell'
import { requireAuth } from '#/lib/route-guards'

export const Route = createFileRoute( '/app' )( {
  beforeLoad: () => requireAuth(),
  component: AppShell,
} )
