import { RunMetricsSchema, TelemetryEventTypeSchema } from "@/schemas/platform";

type ScoringInput = {
  runId: string;
  submissionId: string;
  eventTypes: string[];
  latenciesMs: number[];
  runDurationSeconds: number;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const percentile = (values: number[], p: number): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.floor((p / 100) * (sorted.length - 1));
  return sorted[index] ?? 0;
};

export const computeRunMetrics = (input: ScoringInput) => {
  const totalRequests = input.eventTypes.filter((type) => type === "request_sent").length;
  const succeededRequests = input.eventTypes.filter((type) => type === "request_acknowledged").length;
  const timedOutRequests = input.eventTypes.filter((type) => type === "request_timed_out").length;
  const failedRequests = input.eventTypes.filter((type) =>
    ["request_rejected", "container_crash", "health_check_failed", "contract_violation"].includes(type)
  ).length;

  const duration = Math.max(1, input.runDurationSeconds);
  const tpsSustained = succeededRequests / duration;
  const tpsPeak = tpsSustained * 1.2;
  const p50 = percentile(input.latenciesMs, 50);
  const p90 = percentile(input.latenciesMs, 90);
  const p99 = percentile(input.latenciesMs, 99);

  const latencyScore = clamp(100 - p99 / 10, 0, 100);
  const throughputScore = clamp(tpsSustained * 10, 0, 100);
  const correctnessScore = clamp(100 - failedRequests * 2, 0, 100);
  const crashCount = input.eventTypes.filter((type) => type === "container_crash").length;
  const stabilityScore = clamp(100 - timedOutRequests - crashCount * 20, 0, 100);
  const finalScore = clamp(
    0.35 * latencyScore + 0.2 * throughputScore + 0.35 * correctnessScore + 0.1 * stabilityScore,
    0,
    100
  );

  return RunMetricsSchema.parse({
    runId: input.runId,
    submissionId: input.submissionId,
    totalRequests,
    succeededRequests,
    failedRequests,
    timedOutRequests,
    tpsPeak,
    tpsSustained,
    latency: { p50, p90, p99 },
    correctnessScore,
    stabilityScore,
    finalScore,
  });
};

export const isTelemetryType = (value: string): boolean => TelemetryEventTypeSchema.safeParse(value).success;
