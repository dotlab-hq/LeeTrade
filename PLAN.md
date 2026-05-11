Below is a PRD/prospectus tailored to the hackathon brief: a **Distributed Benchmarking and Hosting Platform** for contestant-submitted trading infrastructure, with **sandboxed code execution, distributed bot load, telemetry/validation, and live leaderboard scoring**. The brief explicitly calls out containerized deployment, scalable bot traffic, latency/throughput/correctness measurement, and architecture/IaC deliverables. 

# PRD: Distributed Benchmarking and Hosting Platform

## 1) Product summary

Build a platform where a contestant submits code for a trading component, such as an orderbook or matching engine. The platform:

1. Accepts code or binaries.
2. Builds and isolates the submission in a container sandbox.
3. Exposes a predefined runtime contract to the contestant service.
4. Spawns a distributed fleet of bots that generate realistic market traffic.
5. Measures latency, throughput, and correctness.
6. Streams results into a live leaderboard. 

This is not a generic coding challenge platform. It is an execution-and-evaluation infrastructure platform.

---

## 2) Core product goals

### Primary goals

* Run untrusted contestant code safely and reproducibly.
* Support multiple language/runtime submissions.
* Stress test contestant services at scale.
* Produce fair, deterministic scoring.
* Show real-time benchmarking results and rankings.

### Secondary goals

* Make evaluation rules configurable per challenge.
* Support different HFT components, not only orderbooks.
* Allow per-challenge API contracts and load profiles.
* Keep infra horizontally scalable.

---

## 3) Non-goals

* Not a general-purpose IDE or teaching platform.
* Not a CP-style “run one executable and return output” judge.
* Not a trading simulator for real markets.
* Not a production exchange.

---

## 4) Target users

### Contestant

Uploads code, sees validation errors, container logs, benchmark scores, and ranking.

### Organizer

Defines challenge rules, submission contract, resource limits, scoring weights, and traffic profiles.

### Judge / Admin

Approves challenge templates, monitors failures, reviews suspicious submissions, and replays runs.

### Viewer

Watches live leaderboard and run telemetry.

---

## 5) User stories

### Contestant

* I can upload source code or a container image.
* I can see whether my service boots correctly.
* I can inspect logs when my code fails.
* I can run a dry validation before full benchmarking.
* I can see why I ranked above or below others.

### Organizer

* I can define the required endpoints or websocket contract.
* I can define resource limits per challenge.
* I can define the load shape, bot behavior, and scoring weights.
* I can add challenge-specific correctness rules.

### Judge

* I can replay a run deterministically.
* I can inspect latency percentiles and failure traces.
* I can mark a submission as invalid if it violates the contract.

---

# 6) System overview

## Pipeline

1. Submission upload.
2. Static validation.
3. Build/package.
4. Sandbox deploy.
5. Health check.
6. Warmup.
7. Bot fleet load test.
8. Telemetry ingestion.
9. Scoring.
10. Leaderboard update.

The brief expects the platform to handle submission code, container management, compilation, and health checks in the infrastructure layer rather than focusing on the endpoint design itself. It also explicitly expects the contestant service to expose endpoints the platform can call inside a containerized environment. 

---

# 7) Functional requirements

## 7.1 Submission service

* Upload source zip, git repo snapshot, or OCI image.
* Detect language/runtime.
* Optional build step.
* Virus/malware scanning.
* Dependency lock verification.
* Output immutable artifact version.

## 7.2 Sandbox engine

* Create isolated container per run.
* Apply CPU/memory limits.
* Disable privileged mode.
* Restrict network egress by default.
* Mount only challenge input and runtime config.
* Enforce startup timeout, warmup timeout, and runtime timeout.

The brief explicitly mentions strict isolation, CPU pinning, and memory limits. 

## 7.3 Challenge contract service

* Define API/WebSocket/FIX endpoints expected from contestant.
* Validate startup contract before traffic begins.
* Generate challenge-specific request schemas.

## 7.4 Load generator

* Create thousands of bot workers.
* Distribute across nodes.
* Support order types: limit, market, cancel.
* Support burst, ramp, steady-state, and randomized volatility patterns.
* Track per-bot behavior and request IDs.

The brief specifically requires a scalable traffic generation service that can spawn thousands of distributed bots and simulate high-velocity FIX, REST, or WebSocket requests. 

## 7.5 Telemetry & correctness engine

* Record acknowledgment latency.
* Compute p50 / p90 / p99.
* Compute TPS before failure.
* Validate correctness rules like price-time priority and fill accuracy.
* Track crash, timeout, and contract violations.

## 7.6 Leaderboard

* Live score stream.
* Ordered rankings.
* Per-run and per-submission views.
* Audit trail for each score.

## 7.7 Replay and audit

* Replay the exact load profile.
* Recompute scores from stored telemetry.
* Store artifacts for dispute resolution.

---

# 8) Challenge configurability

The key design choice is to make **challenge definitions data-driven**.

Examples:

* **Orderbook challenge**: heavy focus on BBO, spread behavior, price-time priority, matching accuracy.
* **Matching engine challenge**: strict fill consistency and market order handling.
* **Risk engine challenge**: validation of limits and rejection paths.
* **Routing engine challenge**: throughput and routing correctness.

So the platform should not hardcode “orderbook”; instead, it should run a **challenge manifest** that defines:

* runtime contract
* expected endpoints
* load profile
* scoring weights
* correctness checks
* resource limits
* timeout policy

---

# 9) Proposed architecture

## Services

### 1. API Gateway

* Auth, rate limit, submission intake, admin APIs.

### 2. Submission Orchestrator

* Receives submission metadata.
* Validates manifest.
* Creates build and run jobs.

### 3. Build Worker

* Compiles source or converts into runnable artifact.
* Produces OCI image or executable bundle.

### 4. Sandbox Manager

* Spins up isolated containers or pods.
* Applies CPU/memory/network policy.
* Health-checks the contestant service.

### 5. Challenge Registry

* Stores challenge definitions and endpoint contracts.

### 6. Load Generator Control Plane

* Creates test runs.
* Allocates bot shards.
* Coordinates bot start/stop.

### 7. Bot Workers

* Stateless request generators.
* Pull per-run config.
* Emit telemetry events.

### 8. Telemetry Ingestor

* Streams events into storage.
* Aggregates percentiles and correctness counters.

### 9. Scoring Engine

* Consumes telemetry and challenge rules.
* Produces final and partial scores.

### 10. Leaderboard Service

* Reads scores.
* Serves live ranking to UI.

### 11. Artifact Store

* Submission source, build logs, runtime logs, telemetry snapshots, replay files.

---

# 10) Data flow

## Submission flow

1. User uploads submission.
2. System validates manifest.
3. Build worker creates runnable artifact.
4. Sandbox manager deploys it.
5. Health probe verifies endpoints.
6. Run is scheduled.
7. Bot fleet starts in waves.
8. Metrics are ingested in real time.
9. Score is computed and ranked.
10. Leaderboard updates.

## Failure flow

* If build fails: submission marked invalid.
* If health check fails: no benchmark, show boot error.
* If runtime crashes: partial benchmark + failure tag.
* If contract mismatch: run invalidated or penalized.

---

# 11) Storage design

## PostgreSQL

Relational source of truth for:

* users
* teams
* challenges
* submissions
* runs
* score summaries
* permissions

## Redis

* ephemeral run state
* leaderboard cache
* bot coordination
* rate limits
* health state

## TimescaleDB or ClickHouse

* high-volume telemetry
* latency samples
* throughput time series
* per-bot event stream summaries

## Object storage

* source archives
* compiled artifacts
* logs
* replay bundles
* run snapshots

---

# 12) Scoring model

A practical score should combine speed, stability, and correctness.

## Example weighted score

* 40% latency score
* 25% throughput score
* 25% correctness score
* 10% stability score

## Example formulas

### Latency score

Based on p50/p90/p99 weighted heavily toward p99.

### Throughput score

Throughput at stable success rate, not raw request count.

### Correctness score

Penalty for:

* bad fills
* invalid ordering
* state divergence
* missed acknowledgments
* wrong BBO updates

### Stability score

Penalty for:

* crash
* timeout
* memory violation
* restart
* contract breach

The brief explicitly emphasizes latency, throughput, and correctness as the measured axes. 

---

# 13) Runtime contract for contestants

The platform should define a challenge-specific contract. For orderbook, a clean default contract could be:

## Required endpoints

* `GET /health`
* `GET /ready`
* `POST /order`
* `POST /cancel`
* `GET /book`
* optional `WS /stream`

## Example request semantics

* `POST /order` accepts limit/market orders.
* `POST /cancel` cancels an order by ID.
* `GET /book` returns current top-of-book or full depth.
* `/health` only checks process liveness.
* `/ready` checks initialization completion.

## Example response semantics

* every accepted order returns:

  * `accepted: boolean`
  * `orderId`
  * `ts`
  * `reason` if rejected

The exact endpoint contract should be challenge-defined, not platform-defined.

---

# 14) Deep Zod schema design

Below is a practical TypeScript/Zod design for the whole platform.

## 14.1 Shared primitives

```ts
import { z } from "zod";

export const IdSchema = z.string().min(1);
export const UuidSchema = z.string().uuid();
export const IsoDateTimeSchema = z.string().datetime();
export const NonEmptyStringSchema = z.string().trim().min(1);
export const PositiveIntSchema = z.number().int().positive();
export const NonNegativeIntSchema = z.number().int().nonnegative();
export const PercentSchema = z.number().min(0).max(100);
```

---

## 14.2 Enums

```ts
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

export const RunStatusSchema = z.enum([
  "queued",
  "starting",
  "warming_up",
  "live",
  "draining",
  "completed",
  "aborted",
  "failed",
]);

export const SeveritySchema = z.enum(["info", "warning", "error"]);
```

---

## 14.3 Submission manifest

This is the contract the contestant uploads with their code.

```ts
export const ResourceLimitsSchema = z.object({
  cpuMillicores: z.number().int().min(50),
  memoryMb: z.number().int().min(64),
  ephemeralStorageMb: z.number().int().min(128),
  timeoutSeconds: z.number().int().min(5).max(3600),
  startupTimeoutSeconds: z.number().int().min(1).max(300),
  maxFileSizeMb: z.number().int().min(1).max(1024),
});

export const PortBindingSchema = z.object({
  containerPort: z.number().int().min(1).max(65535),
  protocol: z.enum(["tcp", "udp"]),
  exposure: z.enum(["internal", "websocket", "http"]),
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
  env: z.record(z.string()).default({}),
  ports: z.array(PortBindingSchema).min(1),
  endpoints: z.array(EndpointSchema).min(1),
  resources: ResourceLimitsSchema,
  notes: z.string().max(5000).optional(),
});
```

### Why this matters

The manifest gives you a single source of truth for how to build and run contestant code, while still letting each challenge define its own API contract.

---

## 14.4 Submission upload schema

```ts
export const SubmissionUploadSchema = z.object({
  teamId: UuidSchema,
  challengeId: UuidSchema,
  type: SubmissionTypeSchema,
  sourceUrl: z.string().url().optional(),
  archiveFileName: z.string().min(1).optional(),
  manifest: SubmissionManifestSchema,
  declaredSha256: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
  submittedAt: IsoDateTimeSchema,
});
```

---

## 14.5 Challenge definition schema

This is the most important schema on the organizer side.

```ts
export const ScoringWeightsSchema = z.object({
  latency: PercentSchema,
  throughput: PercentSchema,
  correctness: PercentSchema,
  stability: PercentSchema,
}).refine(
  (v) => v.latency + v.throughput + v.correctness + v.stability === 100,
  { message: "Scoring weights must sum to 100" }
);

export const LatencyPolicySchema = z.object({
  p50Weight: z.number().min(0).max(1),
  p90Weight: z.number().min(0).max(1),
  p99Weight: z.number().min(0).max(1),
  maxAllowedMs: z.number().positive(),
});

export const CorrectnessRuleSchema = z.object({
  id: NonEmptyStringSchema,
  name: NonEmptyStringSchema,
  description: z.string().optional(),
  penaltyPoints: z.number().min(0),
  severity: SeveritySchema.default("error"),
});

export const LoadPhaseSchema = z.object({
  name: NonEmptyStringSchema,
  durationSeconds: PositiveIntSchema,
  bots: PositiveIntSchema,
  qpsPerBot: z.number().nonnegative(),
  jitterMs: z.number().nonnegative().default(0),
  burstiness: z.number().min(0).max(1).default(0),
});

export const BotBehaviorSchema = z.object({
  orderMix: z.object({
    limit: z.number().min(0).max(1),
    market: z.number().min(0).max(1),
    cancel: z.number().min(0).max(1),
  }).refine((v) => Math.abs(v.limit + v.market + v.cancel - 1) < 1e-6, {
    message: "Order mix must sum to 1",
  }),
  symbolCount: PositiveIntSchema,
  priceBands: z.array(z.number()).min(2),
  volumeRange: z.object({
    min: PositiveIntSchema,
    max: PositiveIntSchema,
  }).refine((v) => v.min <= v.max, { message: "min must be <= max" }),
});

export const ChallengeDefinitionSchema = z.object({
  id: UuidSchema,
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: NonEmptyStringSchema,
  kind: ChallengeKindSchema,
  version: z.number().int().positive(),
  protocol: RuntimeProtocolSchema,
  expectedEndpoints: z.array(EndpointSchema).min(1),
  resourceDefaults: ResourceLimitsSchema,
  scoringWeights: ScoringWeightsSchema,
  latencyPolicy: LatencyPolicySchema,
  correctnessRules: z.array(CorrectnessRuleSchema).default([]),
  loadPhases: z.array(LoadPhaseSchema).min(1),
  botBehavior: BotBehaviorSchema,
  warmupSeconds: z.number().int().min(0).default(0),
  cooldownSeconds: z.number().int().min(0).default(0),
  replayable: z.boolean().default(true),
});
```

### Important refinement

This schema lets the organizer define different load profiles for different components. That directly matches your requirement that orderbook tests may be BBO-heavy while other submissions need different data shapes.

---

## 14.6 Bot event schema

```ts
export const OrderSideSchema = z.enum(["buy", "sell"]);
export const OrderTypeSchema = z.enum(["limit", "market"]);
export const BotActionTypeSchema = z.enum(["submit_order", "cancel_order", "query_book", "heartbeat"]);

export const BotActionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("submit_order"),
    botId: UuidSchema,
    requestId: UuidSchema,
    symbol: NonEmptyStringSchema,
    side: OrderSideSchema,
    orderType: OrderTypeSchema,
    price: z.number().positive().optional(),
    quantity: PositiveIntSchema,
    clientTs: IsoDateTimeSchema,
  }),
  z.object({
    type: z.literal("cancel_order"),
    botId: UuidSchema,
    requestId: UuidSchema,
    orderId: NonEmptyStringSchema,
    clientTs: IsoDateTimeSchema,
  }),
  z.object({
    type: z.literal("query_book"),
    botId: UuidSchema,
    requestId: UuidSchema,
    symbol: NonEmptyStringSchema,
    clientTs: IsoDateTimeSchema,
  }),
  z.object({
    type: z.literal("heartbeat"),
    botId: UuidSchema,
    requestId: UuidSchema,
    clientTs: IsoDateTimeSchema,
  }),
]);
```

---

## 14.7 Telemetry event schema

```ts
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
  eventId: UuidSchema,
  runId: UuidSchema,
  submissionId: UuidSchema,
  botId: UuidSchema.optional(),
  requestId: UuidSchema.optional(),
  type: TelemetryEventTypeSchema,
  ts: IsoDateTimeSchema,
  latencyMs: z.number().nonnegative().optional(),
  statusCode: z.number().int().optional(),
  message: z.string().optional(),
  metadata: z.record(z.any()).default({}),
});
```

---

## 14.8 Aggregated metrics schema

```ts
export const PercentileSchema = z.object({
  p50: z.number().nonnegative(),
  p90: z.number().nonnegative(),
  p99: z.number().nonnegative(),
});

export const RunMetricsSchema = z.object({
  runId: UuidSchema,
  submissionId: UuidSchema,
  totalRequests: NonNegativeIntSchema,
  succeededRequests: NonNegativeIntSchema,
  failedRequests: NonNegativeIntSchema,
  timedOutRequests: NonNegativeIntSchema,
  tpsPeak: z.number().nonnegative(),
  tpsSustained: z.number().nonnegative(),
  latency: PercentileSchema,
  correctnessScore: z.number().min(0).max(100),
  stabilityScore: z.number().min(0).max(100),
  finalScore: z.number().min(0).max(100),
});
```

---

## 14.9 Leaderboard schema

```ts
export const LeaderboardEntrySchema = z.object({
  rank: PositiveIntSchema,
  submissionId: UuidSchema,
  teamId: UuidSchema,
  challengeId: UuidSchema,
  score: z.number().min(0).max(100),
  latencyScore: z.number().min(0).max(100),
  throughputScore: z.number().min(0).max(100),
  correctnessScore: z.number().min(0).max(100),
  stabilityScore: z.number().min(0).max(100),
  updatedAt: IsoDateTimeSchema,
  status: z.enum(["pending", "live", "final"]),
});
```

---

## 14.10 Build and sandbox schemas

```ts
export const BuildJobSchema = z.object({
  buildJobId: UuidSchema,
  submissionId: UuidSchema,
  status: z.enum(["queued", "running", "succeeded", "failed"]),
  builderImage: z.string().min(1),
  logsUrl: z.string().url().optional(),
  startedAt: IsoDateTimeSchema.optional(),
  finishedAt: IsoDateTimeSchema.optional(),
});

export const SandboxInstanceSchema = z.object({
  instanceId: UuidSchema,
  submissionId: UuidSchema,
  challengeId: UuidSchema,
  podName: z.string().min(1),
  nodeName: z.string().optional(),
  internalUrl: z.string().url(),
  status: z.enum(["creating", "running", "unhealthy", "terminated"]),
  cpuLimitMillicores: z.number().int().positive(),
  memoryLimitMb: z.number().int().positive(),
  startedAt: IsoDateTimeSchema,
});
```

---

# 15) Orderbook-specific challenge profile

Since your example is orderbook-heavy, here is the specialization.

## Additional rules

* Validate best bid/offer correctness.
* Validate price-time priority.
* Validate cancellation semantics.
* Validate fill quantities and partial fills.
* Validate latency under BBO-heavy traffic.

## Specialized challenge definition

* order mix should be bursty around market open/close patterns
* symbols should have hot and cold partitions
* cancels should cluster on stale quotes
* market orders should stress spread crossings
* correctness should weigh order sequencing and fill accuracy heavily

## Suggested scoring for orderbook

* correctness: 35
* latency: 35
* throughput: 20
* stability: 10

That works better than raw TPS-only scoring because orderbook logic can be fast but wrong.

---

# 16) API contract design for the platform itself

## Organizer APIs

* `POST /admin/challenges`
* `POST /admin/challenges/:id/publish`
* `POST /admin/runs/:runId/start`
* `POST /admin/runs/:runId/stop`
* `GET /admin/runs/:runId/telemetry`
* `GET /admin/submissions/:id/build-logs`

## Contestant-facing APIs

* `POST /submissions`
* `GET /submissions/:id`
* `GET /submissions/:id/status`
* `GET /submissions/:id/logs`
* `GET /leaderboard/:challengeId`

## Internal APIs

* `POST /orchestrator/build`
* `POST /orchestrator/deploy`
* `POST /orchestrator/run`
* `POST /telemetry/ingest`
* `POST /scoring/compute`

---

# 17) Security model

## Sandbox isolation

* per-run container namespace
* seccomp / AppArmor / gVisor / Kata / Firecracker depending on budget
* read-only root filesystem
* no privileged container
* no host mounts
* no outbound network except optional challenge-specific allowlist

## Build isolation

* builds happen in separate ephemeral workers
* no shared cache between hostile submissions unless sanitized
* strict artifact whitelisting

## Abuse prevention

* submission size limits
* API rate limiting
* bot auth tokens
* run-level quotas
* deny access to platform metadata
* strict log sanitization

---

# 18) Observability

## Metrics

* build success rate
* sandbox boot time
* health check failures
* request p50/p90/p99
* sustained TPS
* crash frequency
* leaderboard update lag

## Logs

* build logs
* runtime logs
* bot request traces
* validation errors
* scoring trace

## Tracing

* submission ID
* run ID
* bot ID
* request ID
* container ID

---

# 19) Milestone plan

## MVP

* upload submission
* build and sandbox
* one challenge type
* one bot fleet
* telemetry ingestion
* leaderboard

## V1

* multiple challenge templates
* replay
* richer correctness engine
* failure auditing
* admin challenge editor

## V2

* multi-region bot fleet
* adaptive load generation
* fairness normalization
* dispute replay portal
* autoscaling sandbox pool

---

# 20) Key design decision

The most important architectural choice is to make the **contestant contract data-driven** and **challenge-specific**, not hardcoded. That lets you support orderbook, matching engine, and future HFT components with the same core platform.

---

If you want, I can turn this into a **clean engineering PRD doc format** or a **full TypeScript project scaffold with these Zod schemas split into files**.
