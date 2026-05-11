CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_challenges" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"kind" text NOT NULL,
	"protocol" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"definition" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "platform_challenges_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "platform_leaderboard_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"challenge_id" text NOT NULL,
	"submission_id" text NOT NULL,
	"team_id" text NOT NULL,
	"score" double precision NOT NULL,
	"latency_score" double precision NOT NULL,
	"throughput_score" double precision NOT NULL,
	"correctness_score" double precision NOT NULL,
	"stability_score" double precision NOT NULL,
	"status" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"challenge_id" text NOT NULL,
	"status" text NOT NULL,
	"started_at" timestamp,
	"stopped_at" timestamp,
	"metrics" text DEFAULT '{}' NOT NULL,
	"build_logs" text DEFAULT '[]' NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "platform_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"challenge_id" text NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"status" text NOT NULL,
	"source_url" text,
	"archive_file_name" text,
	"manifest" text NOT NULL,
	"declared_sha256" text,
	"submitted_at" timestamp NOT NULL,
	"logs" text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_telemetry_events" (
	"event_id" text PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"submission_id" text NOT NULL,
	"bot_id" text,
	"request_id" text,
	"type" text NOT NULL,
	"ts" timestamp NOT NULL,
	"latency_ms" double precision,
	"status_code" integer,
	"message" text,
	"metadata" text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" text DEFAULT 'false' NOT NULL,
	"image" text,
	"role" text DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
