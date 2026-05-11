import { z } from 'zod'

export const leaderboardEntrySchema = z.object({
  rank: z.number(),
  submissionId: z.string().uuid(),
  teamId: z.string().uuid(),
  score: z.number(),
  latencyScore: z.number(),
  throughputScore: z.number(),
  correctnessScore: z.number(),
  status: z.string(),
  updatedAt: z.string().datetime(),
})

export const leaderboardResponseSchema = z.object({
  challengeId: z.string().uuid(),
  entries: z.array(leaderboardEntrySchema),
})

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>
export type LeaderboardResponse = z.infer<typeof leaderboardResponseSchema>