import { z } from 'zod'
import { challengeKindSchema, protocolSchema } from '@/hooks/schemas/submissions'
import { scoringWeightsSchema } from '@/hooks/schemas/admin'

export const challengeSchema = z.object( {
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  kind: challengeKindSchema,
  protocol: protocolSchema,
  version: z.number(),
  definition: z.object( {
    expectedEndpoints: z.array( z.object( {
      method: z.string(),
      path: z.string(),
    } ) ),
    resourceDefaults: z.record( z.string(), z.unknown() ),
    scoringWeights: scoringWeightsSchema,
    warmupSeconds: z.number(),
    cooldownSeconds: z.number(),
    replayable: z.boolean(),
  } ),
  published: z.boolean(),
  createdBy: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
} )

export const challengeSummarySchema = z.object( {
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  kind: challengeKindSchema,
  protocol: protocolSchema,
  published: z.boolean(),
  createdAt: z.string().datetime(),
} )

export type Challenge = z.infer<typeof challengeSchema>
export type ChallengeSummary = z.infer<typeof challengeSummarySchema>