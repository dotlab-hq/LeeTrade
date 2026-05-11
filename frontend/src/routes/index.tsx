import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Trophy, BarChart3, Code2, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

export const Route = createFileRoute('/')({ component: Landing })

function Landing() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/90 backdrop-blur-md">
        <div className="page-wrap flex h-14 items-center justify-between">
          <Link to="/" className="text-lg font-semibold text-on-dark">LeetTrade</Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/challenges" className="text-sm text-body hover:text-on-dark">Challenges</Link>
            <Link to="/leaderboard" className="text-sm text-body hover:text-on-dark">Leaderboard</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-body">Sign In</Button>
            <Button size="sm" className="bg-primary text-on-primary hover:bg-primary/90">Get Started</Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-hairline">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-0 right-0 h-[240px] bg-gradient-to-br from-hero-stripe-start/30 via-hero-stripe-start/10 to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)' }} />
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-br from-hero-stripe-start/20 via-transparent to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 70%, 10% 90%)' }} />
        </div>
        <div className="page-wrap relative py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="island-kicker mb-4">Trading Algorithm Arena</p>
            <h1 className="text-4xl font-semibold leading-tight text-on-dark md:text-6xl" style={{ fontFeatureSettings: '"liga" 0, "ss02", "ss08"' }}>
              Build. Compete.<br />Dominate the&nbsp;market.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-body">
              LeetTrade is the premier competitive coding platform for financial algorithms.
              Benchmark your engines against the best, climb the leaderboard, and prove your
              low-latency mastery.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Button asChild size="lg" className="bg-primary text-on-primary hover:bg-primary/90">
                <Link to="/challenges">Explore Challenges <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="page-wrap py-24">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border border-hairline bg-surface p-6">
              <f.icon className="size-6 text-accent-blue mb-3" />
              <h3 className="text-base font-medium text-on-dark mb-2">{f.title}</h3>
              <p className="text-sm text-body">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-wrap py-24 border-t border-hairline">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold text-on-dark">Ready to compete?</h2>
          <p className="mt-3 text-body max-w-md">Join the community of trading algorithm engineers pushing the boundaries of low-latency performance.</p>
          <Button asChild className="mt-6 bg-primary text-on-primary hover:bg-primary/90">
            <Link to="/challenges">Browse Challenges <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-hairline py-12">
        <div className="page-wrap flex items-center justify-between">
          <p className="text-sm text-mute">LeetTrade — Algorithmic Trading Arena</p>
          <div className="flex gap-6 text-sm text-mute">
            <Link to="/challenges">Challenges</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  { icon: Zap, title: 'Low-Latency Focus', description: 'Compete on P99 latency, throughput, and correctness. Your engine vs the market simulator.' },
  { icon: Shield, title: 'Realistic Benchmarks', description: 'Burst traffic, order book stress, risk validation — real-world patterns, controlled environments.' },
  { icon: Code2, title: 'Multi-Language Support', description: 'Submit in Rust, C++, Go, Java, or Python. The matching engine doesn\'t care about your stack.' },
]
