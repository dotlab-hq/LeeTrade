import { z } from "@hono/zod-openapi";

export const IdSchema = z.string().uuid();
export const IsoDateTimeSchema = z.string().datetime();
export const NonEmptyStringSchema = z.string().trim().min(1);
export const PositiveIntSchema = z.number().int().positive();
export const NonNegativeIntSchema = z.number().int().nonnegative();
export const PercentSchema = z.number().min(0).max(100);

export const SubmissionTypeSchema = z.enum(["source", "binary", "image"]);
export const LanguageSchema = z.enum(["cpp", "rust", "go", "java", "python", "node", "custom"]);
export const ChallengeKindSchema = z.enum(["orderbook", "matching_engine", "risk_engine", "router", "custom"]);
export const RuntimeProtocolSchema = z.enum(["rest", "websocket", "fix", "grpc"]);
export const SubmissionStatusSchema = z.enum([
  "uploaded",
  "validating",
  "build_queued",
  "building",
  "build_failed",
  "deploying",
  "running",
  "ready",
  "testing",
  "completed",
  "failed",
  "invalid",
]);
export const RunStatusSchema = z.enum(["queued", "starting", "warming_up", "live", "draining", "completed", "aborted", "failed"]);
export const LeaderboardStatusSchema = z.enum(["pending", "live", "final"]);

export const ResourceLimitsSchema = z.object({
  cpuMillicores: z.number().int().min(50),
  memoryMb: z.number().int().min(64),
  ephemeralStorageMb: z.number().int().min(128),
  timeoutSeconds: z.number().int().min(5).max(3600),
  startupTimeoutSeconds: z.number().int().min(1).max(300),
  maxFileSizeMb: z.number().int().min(1).max(1024),
});

export const EndpointSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "WS"]),
  path: z.string().min(1),
  description: z.string().optional(),
  requestSchemaRef: z.string().optional(),
  responseSchemaRef: z.string().optional(),
  required: z.boolean().default(true),
});

export const SubmissionManifestSchema = z.object({
  version: z.literal("1"),
  challengeKind: ChallengeKindSchema,
  language: LanguageSchema,
  protocol: RuntimeProtocolSchema,
  entrypoint: z.string().min(1),
  buildCommand: z.string().optional(),
  runCommand: z.string().min(1),
  env: z.record(z.string(), z.string()).default({}),
  endpoints: z.array(EndpointSchema).min(1),
  resources: ResourceLimitsSchema,
  notes: z.string().max(5000).optional(),
});

export const ScoringWeightsSchema = z
  .object({
    latency: PercentSchema,
    throughput: PercentSchema,
    correctness: PercentSchema,
    stability: PercentSchema,
  })
  .refine((v) => v.latency + v.throughput + v.correctness + v.stability === 100, {
    message: "Scoring weights must sum to 100",
  });

export const ChallengeDefinitionInputSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: NonEmptyStringSchema,
  kind: ChallengeKindSchema,
  protocol: RuntimeProtocolSchema,
  version: z.number().int().positive().default(1),
  expectedEndpoints: z.array(EndpointSchema).min(1),
  resourceDefaults: ResourceLimitsSchema,
  scoringWeights: ScoringWeightsSchema,
  warmupSeconds: z.number().int().min(0).default(0),
  cooldownSeconds: z.number().int().min(0).default(0),
  replayable: z.boolean().default(true),
});

export const SubmissionUploadSchema = z.object({
  teamId: IdSchema,
  challengeId: IdSchema,
  type: SubmissionTypeSchema,
  sourceUrl: z.string().url().optional(),
  archiveFileName: z.string().min(1).optional(),
  manifest: SubmissionManifestSchema,
  declaredSha256: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
  submittedAt: IsoDateTimeSchema,
});

export const TelemetryEventTypeSchema = z.enum([
  "request_sent",
  "request_acknowledged",
  "request_rejected",
  "request_timed_out",
  "container_crash",
  "health_check_failed",
  "contract_violation",
]);

export const TelemetryEventSchema = z.object({
  eventId: IdSchema,
  runId: IdSchema,
  submissionId: IdSchema,
  botId: IdSchema.optional(),
  requestId: IdSchema.optional(),
  type: TelemetryEventTypeSchema,
  ts: IsoDateTimeSchema,
  latencyMs: z.number().nonnegative().optional(),
  statusCode: z.number().int().optional(),
  message: z.string().optional(),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const RunMetricsSchema = z.object({
  runId: IdSchema,
  submissionId: IdSchema,
  totalRequests: NonNegativeIntSchema,
  succeededRequests: NonNegativeIntSchema,
  failedRequests: NonNegativeIntSchema,
  timedOutRequests: NonNegativeIntSchema,
  tpsPeak: z.number().nonnegative(),
  tpsSustained: z.number().nonnegative(),
  latency: z.object({
    p50: z.number().nonnegative(),
    p90: z.number().nonnegative(),
    p99: z.number().nonnegative(),
  }),
  correctnessScore: PercentSchema,
  stabilityScore: PercentSchema,
  finalScore: PercentSchema,
});
