import { z } from 'zod'

export const submissionTypeSchema = z.enum( ['source', 'binary', 'image'] )
export const languageSchema = z.enum( ['cpp', 'rust', 'go', 'java', 'python', 'node', 'custom'] )
export const protocolSchema = z.enum( ['rest', 'websocket', 'fix', 'grpc'] )
export const challengeKindSchema = z.enum( ['orderbook', 'matching_engine', 'risk_engine', 'router', 'custom'] )
export const submissionStatusSchema = z.enum( [
  'uploaded', 'validating', 'build_queued', 'building', 'build_failed',
  'deploying', 'running', 'ready', 'testing', 'completed', 'failed', 'invalid',
] )
export const runStatusSchema = z.enum( [
  'queued', 'starting', 'warming_up', 'live', 'draining', 'completed', 'aborted', 'failed',
] )
export const roleSchema = z.enum( ['admin', 'organizer', 'judge', 'contestant', 'viewer'] )

export const resourceLimitsSchema = z.object( {
  cpuMillicores: z.number().min( 50 ),
  memoryMb: z.number().min( 64 ),
  ephemeralStorageMb: z.number().min( 128 ),
  timeoutSeconds: z.number().min( 5 ).max( 3600 ),
  startupTimeoutSeconds: z.number().min( 1 ).max( 300 ),
  maxFileSizeMb: z.number().min( 1 ).max( 1024 ),
} )

export const endpointSchema = z.object( {
  method: z.enum( ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'WS'] ),
  path: z.string(),
  description: z.string().optional(),
  requestSchemaRef: z.string().optional(),
  responseSchemaRef: z.string().optional(),
  required: z.boolean().optional(),
} )

export const submissionManifestSchema = z.object( {
  version: z.literal( '1' ),
  challengeKind: challengeKindSchema,
  language: languageSchema,
  protocol: protocolSchema,
  entrypoint: z.string(),
  buildCommand: z.string().optional(),
  runCommand: z.string(),
  env: z.record( z.string(), z.string() ).optional(),
  endpoints: z.array( endpointSchema ),
  resources: resourceLimitsSchema,
  notes: z.string().optional(),
} )

export const createSubmissionSchema = z.object( {
  teamId: z.string().uuid(),
  challengeId: z.string().uuid(),
  type: submissionTypeSchema,
  sourceUrl: z.string().url().optional(),
  archiveFileName: z.string().optional(),
  manifest: submissionManifestSchema,
  declaredSha256: z.string().length( 64 ).optional(),
  submittedAt: z.string().datetime(),
} )

export const submissionSchema = z.object( {
  id: z.string().uuid(),
  teamId: z.string().uuid(),
  challengeId: z.string().uuid(),
  userId: z.string().uuid(),
  type: submissionTypeSchema,
  status: submissionStatusSchema,
  sourceUrl: z.string().url().nullable(),
  archiveFileName: z.string().nullable(),
  manifest: submissionManifestSchema,
  declaredSha256: z.string().nullable(),
  submittedAt: z.string().datetime(),
  logs: z.array( z.object( {
    ts: z.string().datetime(),
    message: z.string(),
  } ) ),
} )

export const submissionStatusResponseSchema = z.object( {
  id: z.string().uuid(),
  status: submissionStatusSchema,
} )

export const submissionLogsResponseSchema = z.object( {
  submissionId: z.string().uuid(),
  logs: z.array( z.object( {
    ts: z.string().datetime(),
    message: z.string(),
  } ) ),
} )

export const buildLogsResponseSchema = z.object( {
  submissionId: z.string().uuid(),
  logs: z.array( z.object( {
    ts: z.string().datetime(),
    message: z.string(),
  } ) ),
} )

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>
export type Submission = z.infer<typeof submissionSchema>
export type SubmissionStatusResponse = z.infer<typeof submissionStatusResponseSchema>
export type SubmissionLogsResponse = z.infer<typeof submissionLogsResponseSchema>
export type BuildLogsResponse = z.infer<typeof buildLogsResponseSchema>