import { z } from 'zod'
import { roleSchema, endpointSchema, resourceLimitsSchema, challengeKindSchema, protocolSchema } from '@/hooks/schemas/submissions'

export const userSchema = z.object( {
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: roleSchema,
} )

export const paginatedUsersResponseSchema = z.object( {
  users: z.array( userSchema ),
  page: z.number().min( 1 ),
  pageSize: z.number().min( 1 ).max( 100 ),
  total: z.number(),
  pageCount: z.number(),
} )

export const updateUserRoleSchema = z.object( {
  role: roleSchema,
} )

export const scoringWeightsSchema = z.object( {
  latency: z.number().min( 0 ).max( 100 ),
  throughput: z.number().min( 0 ).max( 100 ),
  correctness: z.number().min( 0 ).max( 100 ),
  stability: z.number().min( 0 ).max( 100 ),
} )

export const createChallengeSchema = z.object( {
  slug: z.string().regex( /^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens' ),
  title: z.string().min( 1, 'Title is required' ),
  kind: challengeKindSchema,
  protocol: protocolSchema,
  version: z.number().default( 1 ),
  expectedEndpoints: z.array( endpointSchema ).min( 1, 'At least one endpoint is required' ),
  resourceDefaults: resourceLimitsSchema,
  scoringWeights: scoringWeightsSchema,
  warmupSeconds: z.number().default( 0 ),
  cooldownSeconds: z.number().default( 0 ),
  replayable: z.boolean().default( true ),
} ).refine(
  ( data ) => {
    const { latency, throughput, correctness, stability } = data.scoringWeights
    return latency + throughput + correctness + stability === 100
  },
  { message: 'Scoring weights must sum to 100', path: ['scoringWeights'] }
)

export const containerSummarySchema = z.object( {
  Id: z.string(),
  Image: z.string(),
  State: z.string(),
  Status: z.string(),
  Names: z.array( z.string() ),
} )

export const telemetryEventSchema = z.object( {
  eventId: z.string().uuid(),
  runId: z.string().uuid(),
  submissionId: z.string().uuid(),
  botId: z.string().uuid().optional(),
  requestId: z.string().uuid().optional(),
  type: z.enum( [
    'request_sent', 'request_acknowledged', 'request_rejected', 'request_timed_out',
    'container_crash', 'health_check_failed', 'contract_violation',
  ] ),
  ts: z.string().datetime(),
  latencyMs: z.number().optional(),
  statusCode: z.number().optional(),
  message: z.string().optional(),
  metadata: z.record( z.string(), z.unknown() ).optional(),
} )

export const runTelemetryResponseSchema = z.object( {
  runId: z.string().uuid(),
  metrics: z.record( z.string(), z.unknown() ),
  events: z.array( z.object( {
    eventId: z.string().uuid(),
    type: z.string(),
    ts: z.string().datetime(),
    message: z.string().optional(),
  } ) ),
} )

export const resetSystemResponseSchema = z.object( {
  ok: z.boolean(),
  deleted: z.object( {
    challenges: z.number(),
    submissions: z.number(),
    runs: z.number(),
    telemetryEvents: z.number(),
    leaderboardEntries: z.number(),
  } ),
  removedContainers: z.number(),
} )

export type User = z.infer<typeof userSchema>
export type PaginatedUsersResponse = z.infer<typeof paginatedUsersResponseSchema>
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>
export type ContainerSummary = z.infer<typeof containerSummarySchema>
export type RunTelemetryResponse = z.infer<typeof runTelemetryResponseSchema>
export type ResetSystemResponse = z.infer<typeof resetSystemResponseSchema>