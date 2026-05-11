import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: text("email_verified").notNull().default("false"),
  image: text("image"),
  role: text("role").notNull().default("viewer"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const sessionsTable = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const accountsTable = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: text("access_token_expires_at"),
  refreshTokenExpiresAt: text("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const verificationsTable = sqliteTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});



export const challengesTable = sqliteTable("platform_challenges", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  kind: text("kind").notNull(),
  protocol: text("protocol").notNull(),
  version: integer("version").notNull().default(1),
  definition: text("definition").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const submissionsTable = sqliteTable("platform_submissions", {
  id: text("id").primaryKey(),
  teamId: text("team_id").notNull(),
  challengeId: text("challenge_id").notNull(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  sourceUrl: text("source_url"),
  archiveFileName: text("archive_file_name"),
  manifest: text("manifest").notNull(),
  declaredSha256: text("declared_sha256"),
  submittedAt: text("submitted_at").notNull(),
  logs: text("logs").notNull().default("[]"),
});

export const runsTable = sqliteTable("platform_runs", {
  id: text("id").primaryKey(),
  submissionId: text("submission_id").notNull(),
  challengeId: text("challenge_id").notNull(),
  status: text("status").notNull(),
  startedAt: text("started_at"),
  stoppedAt: text("stopped_at"),
  metrics: text("metrics").notNull().default("{}"),
  buildLogs: text("build_logs").notNull().default("[]"),
  createdBy: text("created_by").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const telemetryEventsTable = sqliteTable("platform_telemetry_events", {
  eventId: text("event_id").primaryKey(),
  runId: text("run_id").notNull(),
  submissionId: text("submission_id").notNull(),
  botId: text("bot_id"),
  requestId: text("request_id"),
  type: text("type").notNull(),
  ts: text("ts").notNull(),
  latencyMs: real("latency_ms"),
  statusCode: integer("status_code"),
  message: text("message"),
  metadata: text("metadata").notNull().default("{}"),
});

export const leaderboardEntriesTable = sqliteTable("platform_leaderboard_entries", {
  id: text("id").primaryKey(),
  challengeId: text("challenge_id").notNull(),
  submissionId: text("submission_id").notNull(),
  teamId: text("team_id").notNull(),
  score: real("score").notNull(),
  latencyScore: real("latency_score").notNull(),
  throughputScore: real("throughput_score").notNull(),
  correctnessScore: real("correctness_score").notNull(),
  stabilityScore: real("stability_score").notNull(),
  status: text("status").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
