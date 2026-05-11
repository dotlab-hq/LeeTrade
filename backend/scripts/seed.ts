import "dotenv/config";
import { faker } from "@faker-js/faker";
import crypto from "node:crypto";
import { db } from "@/db/index";
import {
  usersTable,
  sessionsTable,
  accountsTable,
  verificationsTable,
  challengesTable,
  submissionsTable,
  runsTable,
  telemetryEventsTable,
  leaderboardEntriesTable,
} from "@/db/schema";

const CHALLENGE_KINDS = ["orderbook", "matching_engine", "risk_engine", "router", "custom"] as const;
const PROTOCOLS = ["rest", "websocket", "fix", "grpc"] as const;
const SUBMISSION_TYPES = ["source", "binary", "image"] as const;
const SUBMISSION_STATUSES = [
  "uploaded", "validating", "valid", "invalid", "building",
  "build_failed", "built", "deploying", "deploy_failed",
  "deployed", "running", "completed",
] as const;
const RUN_STATUSES = [
  "queued", "starting", "warming_up", "live",
  "draining", "completed", "aborted", "failed",
] as const;
const TELEMETRY_TYPES = [
  "request_sent", "request_acknowledged", "request_rejected",
  "request_timed_out", "container_crash", "health_check_failed",
  "contract_violation",
] as const;
const LEADERBOARD_STATUSES = ["pending", "live", "final"] as const;

function uid() {
  return crypto.randomUUID();
}

function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number) {
  return faker.number.float({ min, max, fractionDigits: 4 });
}

function pastDate(_agoDays: number) {
  return faker.date.past({ years: 1 });
}

async function seed() {
  console.log("Seeding database...");

  // ── Users ──────────────────────────────────────────────────────
  const userCount = 8;
  const users = Array.from({ length: userCount }, () => ({
    id: uid(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    emailVerified: faker.datatype.boolean() ? "true" : "false",
    image: faker.datatype.boolean() ? faker.image.avatar() : null,
    role: faker.helpers.weightedArrayElement([
      { weight: 1, value: "admin" as const },
      { weight: 3, value: "viewer" as const },
    ]) ?? "viewer",
    createdAt: pastDate(60),
    updatedAt: pastDate(30),
  }));
  await db.insert(usersTable).values(users);
  console.log(`  ✓ ${users.length} users`);

  // ── Sessions ───────────────────────────────────────────────────
  const sessions = users.map((u) => ({
    id: uid(),
    userId: u.id,
    token: faker.string.alphanumeric(64),
    expiresAt: faker.date.future({ years: 1 }),
    ipAddress: faker.internet.ip(),
    userAgent: faker.internet.userAgent(),
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));
  await db.insert(sessionsTable).values(sessions);
  console.log(`  ✓ ${sessions.length} sessions`);

  // ── Accounts ───────────────────────────────────────────────────
  const accounts = users.map((u) => ({
    id: uid(),
    userId: u.id,
    accountId: u.id,
    providerId: "credential",
    accessToken: faker.string.alphanumeric(64),
    refreshToken: faker.datatype.boolean() ? faker.string.alphanumeric(64) : null,
    accessTokenExpiresAt: faker.date.future({ years: 1 }),
    refreshTokenExpiresAt: faker.date.future({ years: 1 }),
    scope: "openid profile email",
    idToken: null,
    password: "$2b$10$" + faker.string.alphanumeric(53),
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));
  await db.insert(accountsTable).values(accounts);
  console.log(`  ✓ ${accounts.length} accounts`);

  // ── Verifications ──────────────────────────────────────────────
  const verifications = users.filter(() => faker.datatype.boolean(0.5)).map((u) => ({
    id: uid(),
    identifier: u.email,
    value: faker.string.alphanumeric(32),
    expiresAt: faker.date.future({ years: 1 }),
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  }));
  await db.insert(verificationsTable).values(verifications);
  console.log(`  ✓ ${verifications.length} verifications`);

  // ── Challenges ─────────────────────────────────────────────────
  const challengeCount = 6;
  const challenges = Array.from({ length: challengeCount }, () => {
    const kind = randomPick(CHALLENGE_KINDS);
    const title = faker.company.catchPhrase();
    return {
      id: uid(),
      slug: faker.helpers.slugify(title).toLowerCase() + "-" + faker.string.alphanumeric(4),
      title,
      kind,
      protocol: randomPick(PROTOCOLS),
      version: 1,
      definition: JSON.stringify({
        endpoints: Array.from({ length: randomInt(2, 5) }, () => ({
          path: `/api/${faker.word.sample()}`,
          method: randomPick(["GET", "POST", "PUT", "DELETE"]),
          description: faker.lorem.sentence(),
        })),
        timeout_ms: randomInt(100, 5000),
        rate_limit: randomInt(10, 1000),
      }),
      published: faker.datatype.boolean(0.7),
      createdBy: randomPick(users).id,
      createdAt: pastDate(50),
      updatedAt: pastDate(10),
    };
  });
  await db.insert(challengesTable).values(challenges);
  console.log(`  ✓ ${challenges.length} challenges`);

  // ── Submissions ────────────────────────────────────────────────
  const submissions = challenges.flatMap((c) => {
    const count = randomInt(1, 3);
    return Array.from({ length: count }, () => {
      const user = randomPick(users);
      const status = randomPick(SUBMISSION_STATUSES);
      return {
        id: uid(),
        teamId: uid(),
        challengeId: c.id,
        userId: user.id,
        type: randomPick(SUBMISSION_TYPES),
        status,
        sourceUrl: faker.internet.url(),
        archiveFileName: `submission-${faker.string.alphanumeric(8)}.tar.gz`,
        manifest: JSON.stringify({
          language: randomPick(["rust", "go", "python", "c++", "java"]),
          version: faker.system.semver(),
          dependencies: Array.from({ length: randomInt(0, 5) }, () => faker.word.sample()),
        }),
        declaredSha256: faker.datatype.boolean(0.8) ? faker.string.hexadecimal({ length: 64 }) : null,
        submittedAt: pastDate(20),
        logs: JSON.stringify(
          Array.from({ length: randomInt(0, 5) }, () => ({
            level: randomPick(["info", "warn", "error"]),
            message: faker.lorem.sentence(),
            ts: pastDate(1).toISOString(),
          }))
        ),
      };
    });
  });
  await db.insert(submissionsTable).values(submissions);
  console.log(`  ✓ ${submissions.length} submissions`);

  // ── Runs ───────────────────────────────────────────────────────
  const runs = submissions.flatMap((s) => {
    const count = randomInt(1, 2);
    return Array.from({ length: count }, () => ({
      id: uid(),
      submissionId: s.id,
      challengeId: s.challengeId,
      status: randomPick(RUN_STATUSES),
      startedAt: pastDate(15),
      stoppedAt: faker.datatype.boolean(0.6) ? pastDate(5) : null,
      metrics: JSON.stringify({
        avg_cpu: randomFloat(10, 90),
        avg_memory_mb: randomFloat(50, 512),
        total_requests: randomInt(100, 10000),
        error_rate: randomFloat(0, 5),
      }),
      buildLogs: JSON.stringify(
        Array.from({ length: randomInt(0, 10) }, () => ({
          line: faker.lorem.sentence(),
          level: randomPick(["info", "warn", "error"]),
          ts: pastDate(1).toISOString(),
        }))
      ),
      createdBy: s.userId,
      createdAt: pastDate(10),
    }));
  });
  await db.insert(runsTable).values(runs);
  console.log(`  ✓ ${runs.length} runs`);

  // ── Telemetry Events ───────────────────────────────────────────
  const telemetryEvents = runs.flatMap((r) => {
    const count = randomInt(2, 8);
    return Array.from({ length: count }, () => ({
      eventId: uid(),
      runId: r.id,
      submissionId: r.submissionId,
      botId: faker.datatype.boolean(0.7) ? uid() : null,
      requestId: faker.datatype.boolean(0.8) ? uid() : null,
      type: randomPick(TELEMETRY_TYPES),
      ts: pastDate(10),
      latencyMs: faker.datatype.boolean(0.7) ? randomFloat(1, 2000) : null,
      statusCode: faker.datatype.boolean(0.7) ? randomPick([200, 201, 400, 401, 403, 404, 429, 500, 502, 503]) : null,
      message: faker.lorem.sentence(),
      metadata: JSON.stringify({
        region: randomPick(["us-east-1", "eu-west-1", "ap-southeast-1"]),
        attempt: randomInt(1, 3),
      }),
    }));
  });
  await db.insert(telemetryEventsTable).values(telemetryEvents);
  console.log(`  ✓ ${telemetryEvents.length} telemetry events`);

  // ── Leaderboard Entries ────────────────────────────────────────
  const completedRuns = runs.filter((r) => r.status === "completed");
  const leaderboardEntries = completedRuns.map((r) => {
    const submission = submissions.find((s) => s.id === r.submissionId)!;
    return {
      id: uid(),
      challengeId: r.challengeId,
      submissionId: r.submissionId,
      teamId: submission.teamId,
      score: randomFloat(50, 100),
      latencyScore: randomFloat(50, 100),
      throughputScore: randomFloat(50, 100),
      correctnessScore: randomFloat(50, 100),
      stabilityScore: randomFloat(50, 100),
      status: randomPick(LEADERBOARD_STATUSES),
      updatedAt: pastDate(5),
    };
  });
  if (leaderboardEntries.length > 0) {
    await db.insert(leaderboardEntriesTable).values(leaderboardEntries);
    console.log(`  ✓ ${leaderboardEntries.length} leaderboard entries`);
  } else {
    console.log("  - 0 leaderboard entries (no completed runs)");
  }

  console.log("\n✅ Seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
