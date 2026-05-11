import { createFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { leaderboard, getChallengeById } from '@/lib/mock-data.ts'
import { PageWrap } from '@/components/app/page-primitives.tsx'
import { Breadcrumb } from '@/components/ui/page-header.tsx'
import { DataTable } from '@/components/ui/table.tsx'
import { Button } from '@/components/ui/button.tsx'
import { createColumnHelper } from '@tanstack/react-table'

export const Route = createFileRoute('/leaderboard/$challengeId/')({
  component: ChallengeLeaderboard,
  notFoundComponent: () => <div className="page-wrap py-24 text-center text-body">Challenge not found</div>,
})

const columnHelper = createColumnHelper<typeof leaderboard[number]>()

const columns = [
  columnHelper.accessor('rank', { header: 'Rank', cell: (info) => <span className="font-medium text-on-dark">#{info.getValue()}</span> }),
  columnHelper.accessor('team', { header: 'Team', cell: (info) => <span className="text-on-dark">{info.getValue()}</span> }),
  columnHelper.accessor('score', { header: 'Score', cell: (info) => <span className="font-medium text-on-dark">{info.getValue().toFixed(1)}</span> }),
  columnHelper.accessor('delta', {
    header: 'Change',
    cell: (info) => {
      const v = info.getValue()
      return (
        <span className={v > 0 ? 'text-accent-green' : v < 0 ? 'text-accent-red' : 'text-mute'}>
          {v > 0 ? `+${v}` : v === 0 ? '—' : v}
        </span>
      )
    },
  }),
  columnHelper.accessor('submissions', { header: 'Submissions', cell: (info) => <span className="text-body">{info.getValue()}</span> }),
  columnHelper.accessor('bestRun', { header: 'Best Run', cell: (info) => <span className="text-mute text-xs">{info.getValue()}</span> }),
]

function ChallengeLeaderboard() {
  const { challengeId } = Route.useParams()
  const challenge = getChallengeById(challengeId)
  const data = useMemo(() => leaderboard, [])

  if (!challenge) return null

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-md">
        <div className="page-wrap flex h-14 items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-on-dark">LeetTrade</Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/challenges" className="text-sm text-body hover:text-on-dark">Challenges</Link>
            <Link to="/leaderboard" className="text-sm text-body hover:text-on-dark">Leaderboard</Link>
          </nav>
        </div>
      </header>
      <PageWrap>
        <Breadcrumb items={[{ label: 'Leaderboard', to: '/leaderboard' }, { label: challenge.name }]} />
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-on-dark">{challenge.name} — Leaderboard</h1>
          <p className="text-sm text-body mt-1">Rankings for this specific challenge.</p>
        </div>
        <DataTable columns={columns} data={data} pageSize={10} />
      </PageWrap>
    </div>
  )
}
