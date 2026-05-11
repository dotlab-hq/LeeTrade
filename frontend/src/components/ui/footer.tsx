import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="border-t border-hairline py-8">
      <div className="page-wrap flex items-center justify-between">
        <p className="text-sm text-mute">LeetTrade — Algorithmic Trading Arena</p>
        <div className="flex gap-6 text-sm text-mute">
          <Link to="/challenges">Challenges</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>
      </div>
    </footer>
  )
}
