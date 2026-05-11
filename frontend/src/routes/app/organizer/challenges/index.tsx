import { createFileRoute, Link } from '@tanstack/react-router'
import { challenges, statusColors } from '@/lib/mock-data.ts'
import { PageHeader, Breadcrumb } from '@/components/ui/page-header.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useUiStore } from '@/stores/ui-store.ts'
import { Plus, Edit3 } from 'lucide-react'
import { useMemo } from 'react'
import { DataTable } from '@/components/ui/table.tsx'
import { createColumnHelper } from '@tanstack/react-table'
import { requireRole } from '#/lib/route-guards'

export const Route = createFileRoute( '/app/organizer/challenges/' )( {
  beforeLoad: () => requireRole( ['admin', 'organizer'] ),
  component: ChallengeManager,
} )

const columnHelper = createColumnHelper<typeof challenges[number]>()

const columns = [
  columnHelper.accessor( 'name', { header: 'Name', cell: ( info ) => <span className="text-on-dark">{info.getValue()}</span> } ),
  columnHelper.accessor( 'difficulty', { header: 'Difficulty', cell: ( info ) => <span className="text-body">{info.getValue()}</span> } ),
  columnHelper.accessor( 'status', { header: 'Status', cell: ( info ) => <span className={`text-xs font-medium ${statusColors[info.getValue()]}`}>{info.getValue()}</span> } ),
  columnHelper.accessor( 'submissions', { header: 'Submissions', cell: ( info ) => <span className="text-body">{info.getValue()}</span> } ),
  columnHelper.accessor( 'participants', { header: 'Participants', cell: ( info ) => <span className="text-body">{info.getValue()}</span> } ),
  columnHelper.display( {
    id: 'actions',
    header: '',
    cell: () => (
      <Button variant="ghost" size="icon-xs">
        <Edit3 className="size-3" />
      </Button>
    ),
  } ),
]

function ChallengeManager() {
  const pushDummyToast = useUiStore( ( s ) => s.pushDummyToast )
  const data = useMemo( () => challenges, [] )

  return (
    <div>
      <Breadcrumb items={[{ label: 'Organizer' }, { label: 'Challenges' }]} />
      <PageHeader
        title="Challenge Manager"
        description="Create and manage challenge definitions."
        actions={<Button onClick={() => pushDummyToast( 'Challenge creation flow started' )}><Plus className="size-4" /> New Challenge</Button>}
      />
      <DataTable columns={columns} data={data} pageSize={10} />
    </div>
  )
}
