import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { submissionStatusColors } from '@/lib/mock-data.ts'
import { useSubmissions } from '@/hooks/api/submissions'
import { PageHeader } from '@/components/ui/page-header.tsx'
import { DataTable } from '@/components/ui/table.tsx'
import { Button } from '@/components/ui/button.tsx'
import { createColumnHelper } from '@tanstack/react-table'

export const Route = createFileRoute('/app/submissions/')({ component: SubmissionList })

const columnHelper = createColumnHelper<any>()

const columns = [
  columnHelper.accessor('id', { header: 'ID', cell: (info) => <span className="font-mono text-xs text-mute">{info.getValue()}</span> }),
  columnHelper.accessor('challengeName', { header: 'Challenge', cell: (info) => <span className="text-on-dark">{info.getValue()}</span> }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const v = info.getValue()
      return <span className={`text-xs font-medium ${submissionStatusColors[v]}`}>{v}</span>
    },
  }),
  columnHelper.accessor('score', { header: 'Score', cell: (info) => info.getValue() ? <span className="text-on-dark">{info.getValue()?.toFixed(1)}</span> : <span className="text-mute">—</span> }),
  columnHelper.accessor('submittedAt', { header: 'Submitted', cell: (info) => <span className="text-body text-xs">{info.getValue()}</span> }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <Button asChild variant="ghost" size="xs">
        <Link to="/app/submissions/$submissionId" params={{ submissionId: row.original.id }}>View</Link>
      </Button>
    ),
  }),
]

function SubmissionList() {
  const { data: submissions = [], isLoading } = useSubmissions()

  const data = useMemo(() => submissions, [submissions])

  return (
    <div>
      <PageHeader
        title="Submissions"
        description="Track and manage your benchmark submissions across all challenges."
        actions={
          <Button asChild>
            <Link to="/app/submissions/new">New Submission</Link>
          </Button>
        }
      />
      {isLoading ? (
        <div className="bg-surface border border-hairline rounded-lg p-12 text-center">
          <p className="text-mute">Loading submissions...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} pageSize={10} />
      )}
    </div>
  )
}
