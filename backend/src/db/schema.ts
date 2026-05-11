import { pgTable, text, integer, doublePrecision, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: text("email_verified").notNull().default("false"),
  image: text("image"),
  role: text("role").notNull().default("viewer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const challengesTable = pgTable("platform_challenges", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  kind: text("kind").notNull(),
  protocol: text("protocol").notNull(),
  version: integer("version").notNull().default(1),
  definition: text("definition").notNull(),
  published: boolean("published").notNull().default(false),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const submissionsTable = pgTable("platform_submissions", {
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
  submittedAt: timestamp("submitted_at").notNull(),
  logs: text("logs").notNull().default("[]"),
});

export const runsTable = pgTable("platform_runs", {
  id: text("id").primaryKey(),
  submissionId: text("submission_id").notNull(),
  challengeId: text("challenge_id").notNull(),
  status: text("status").notNull(),
  startedAt: timestamp("started_at"),
  stoppedAt: timestamp("stopped_at"),
  metrics: text("metrics").notNull().default("{}"),
  buildLogs: text("build_logs").notNull().default("[]"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const telemetryEventsTable = pgTable("platform_telemetry_events", {
  eventId: text("event_id").primaryKey(),
  runId: text("run_id").notNull(),
  submissionId: text("submission_id").notNull(),
  botId: text("bot_id"),
  requestId: text("request_id"),
  type: text("type").notNull(),
  ts: timestamp("ts").notNull(),
  latencyMs: doublePrecision("latency_ms"),
  statusCode: integer("status_code"),
  message: text("message"),
  metadata: text("metadata").notNull().default("{}"),
});

export const leaderboardEntriesTable = pgTable("platform_leaderboard_entries", {
  id: text("id").primaryKey(),
  challengeId: text("challenge_id").notNull(),
  submissionId: text("submission_id").notNull(),
  teamId: text("team_id").notNull(),
  score: doublePrecision("score").notNull(),
  latencyScore: doublePrecision("latency_score").notNull(),
  throughputScore: doublePrecision("throughput_score").notNull(),
  correctnessScore: doublePrecision("correctness_score").notNull(),
  stabilityScore: doublePrecision("stability_score").notNull(),
  status: text("status").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
