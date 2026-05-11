import { faker } from '@faker-js/faker'

export interface Submission {
  id: string
  challengeId: string
  title: string
  status: 'draft' | 'building' | 'ready' | 'testing' | 'completed' | 'failed'
  language: string
  createdAt: Date
  updatedAt: Date
  lastRunId?: string
  score?: number
}

export interface Challenge {
  id: string
  slug: string
  title: string
  description: string
  kind: 'orderbook' | 'matching_engine' | 'risk_engine' | 'router'
  difficulty: 'easy' | 'medium' | 'hard'
  participants: number
  createdAt: Date
}

export interface Run {
  id: string
  submissionId: string
  challengeId: string
  status: 'queued' | 'starting' | 'running' | 'completed' | 'failed'
  startedAt: Date
  completedAt?: Date
  latencyP50: number
  latencyP90: number
  latencyP99: number
  throughputPeak: number
  throughputSustained: number
  correctnessScore: number
  stabilityScore: number
  finalScore: number
}

export interface LeaderboardEntry {
  rank: number
  submissionId: string
  teamName: string
  score: number
  latencyScore: number
  throughputScore: number
  correctnessScore: number
  stabilityScore: number
  status: 'pending' | 'live' | 'final'
}

export function generateMockSubmissions(count: number = 5): Submission[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `sub-${i + 1}`,
    challengeId: `challenge-${Math.floor(Math.random() * 3) + 1}`,
    title: `Submission ${i + 1}`,
    status: (['draft', 'building', 'ready', 'testing', 'completed', 'failed'] as const)[
      Math.floor(Math.random() * 6)
    ],
    language: ['rust', 'cpp', 'go', 'python', 'node'][Math.floor(Math.random() * 5)],
    createdAt: faker.date.past({ days: 30 }),
    updatedAt: faker.date.recent({ days: 10 }),
    lastRunId: `run-${i}`,
    score: Math.random() > 0.3 ? Math.floor(Math.random() * 100) : undefined,
  }))
}

export function generateMockChallenges(count: number = 5): Challenge[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `challenge-${i + 1}`,
    slug: `challenge-${i + 1}`,
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    kind: (['orderbook', 'matching_engine', 'risk_engine', 'router'] as const)[
      Math.floor(Math.random() * 4)
    ],
    difficulty: (['easy', 'medium', 'hard'] as const)[Math.floor(Math.random() * 3)],
    participants: Math.floor(Math.random() * 100) + 10,
    createdAt: faker.date.past({ days: 60 }),
  }))
}

export function generateMockRuns(submissionId: string, count: number = 3): Run[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `run-${submissionId}-${i}`,
    submissionId,
    challengeId: `challenge-${Math.floor(Math.random() * 3) + 1}`,
    status: (['queued', 'starting', 'running', 'completed', 'failed'] as const)[
      Math.floor(Math.random() * 5)
    ],
    startedAt: faker.date.recent({ days: 7 }),
    completedAt: faker.date.recent({ days: 5 }),
    latencyP50: Math.random() * 50 + 1,
    latencyP90: Math.random() * 100 + 50,
    latencyP99: Math.random() * 200 + 100,
    throughputPeak: Math.random() * 10000 + 1000,
    throughputSustained: Math.random() * 5000 + 500,
    correctnessScore: Math.random() * 100,
    stabilityScore: Math.random() * 100,
    finalScore: Math.random() * 100,
  }))
}

export function generateMockLeaderboard(challengeId: string, count: number = 10): LeaderboardEntry[] {
  return Array.from({ length: count })
    .map((_, i) => ({
      rank: i + 1,
      submissionId: `sub-${i + 1}`,
      teamName: faker.company.name(),
      score: Math.max(0, 100 - i * 5 + Math.random() * 10),
      latencyScore: Math.random() * 100,
      throughputScore: Math.random() * 100,
      correctnessScore: Math.random() * 100,
      stabilityScore: Math.random() * 100,
      status: (['pending', 'live', 'final'] as const)[Math.floor(Math.random() * 3)],
    }))
    .sort((a, b) => b.score - a.score)
}
