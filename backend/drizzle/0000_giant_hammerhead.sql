CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`access_token_expires_at` text,
	`refresh_token_expires_at` text,
	`scope` text,
	`id_token` text,
	`password` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `platform_challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`kind` text NOT NULL,
	`protocol` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`definition` text NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_challenges_slug_unique` ON `platform_challenges` (`slug`);--> statement-breakpoint
CREATE TABLE `platform_leaderboard_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`challenge_id` text NOT NULL,
	`submission_id` text NOT NULL,
	`team_id` text NOT NULL,
	`score` real NOT NULL,
	`latency_score` real NOT NULL,
	`throughput_score` real NOT NULL,
	`correctness_score` real NOT NULL,
	`stability_score` real NOT NULL,
	`status` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `platform_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`challenge_id` text NOT NULL,
	`status` text NOT NULL,
	`started_at` text,
	`stopped_at` text,
	`metrics` text DEFAULT '{}' NOT NULL,
	`build_logs` text DEFAULT '[]' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` text NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);--> statement-breakpoint
CREATE TABLE `platform_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text NOT NULL,
	`challenge_id` text NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`source_url` text,
	`archive_file_name` text,
	`manifest` text NOT NULL,
	`declared_sha256` text,
	`submitted_at` text NOT NULL,
	`logs` text DEFAULT '[]' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `platform_telemetry_events` (
	`event_id` text PRIMARY KEY NOT NULL,
	`run_id` text NOT NULL,
	`submission_id` text NOT NULL,
	`bot_id` text,
	`request_id` text,
	`type` text NOT NULL,
	`ts` text NOT NULL,
	`latency_ms` real,
	`status_code` integer,
	`message` text,
	`metadata` text DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` text DEFAULT 'false' NOT NULL,
	`image` text,
	`role` text DEFAULT 'viewer' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
