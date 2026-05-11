import { leaderboardEntriesTable, runsTable, submissionsTable, telemetryEventsTable } from "@/db/schema";
import { db } from "@/db";
import { computeRunMetrics } from "@/services/scoring.service";
import type { AppEnv } from "@/types/app-env";
import { toJsonString } from "@/utils/json";
import { and, eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const computeBodySchema = z.object( { runId: z.string().uuid() } );

export const computeScoringRoute = createRoute( {
  method: "post",
  path: "/compute",
  tags: ["Scoring"],
  summary: "Compute scoring for run",
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: computeBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Scoring computed",
      content: { "application/json": { schema: z.object( { runId: z.string().uuid(), finalScore: z.number() } ) } },
    },
    404: {
      description: "Run not found",
      content: { "application/json": { schema: z.object( { error: z.string() } ) } },
    },
  },
} );

export const computeScoringHandler: RouteHandler<typeof computeScoringRoute, AppEnv> = async ( c ) => {
  const { runId } = c.req.valid( "json" );
  const runRows = await db.select().from( runsTable ).where( eq( runsTable.id, runId ) ).limit( 1 );
  const run = runRows[0];
  if ( !run ) {
    return c.json( { error: "Run not found" }, 404 );
  }
  const submissionRows = await db.select().from( submissionsTable ).where( eq( submissionsTable.id, run.submissionId ) ).limit( 1 );
  const submission = submissionRows[0];
  if ( !submission ) {
    return c.json( { error: "Submission not found" }, 404 );
  }
  const events = await db.select().from( telemetryEventsTable ).where( eq( telemetryEventsTable.runId, runId ) );
  const timestamps = events.map( ( event ) => Date.parse( event.ts ) ).filter( ( ts ) => Number.isFinite( ts ) );
  const sortedTs = timestamps.sort( ( a, b ) => a - b );
  const runDurationSeconds = sortedTs.length >= 2 ? Math.max( 1, Math.floor( ( sortedTs[sortedTs.length - 1]! - sortedTs[0]! ) / 1000 ) ) : 1;
  const metrics = computeRunMetrics( {
    runId,
    submissionId: run.submissionId,
    eventTypes: events.map( ( event ) => event.type ),
    latenciesMs: events.map( ( event ) => event.latencyMs ).filter( ( value ): value is number => typeof value === "number" ),
    runDurationSeconds,
  } );
  await db.update( runsTable ).set( { metrics: toJsonString( metrics ), status: "completed", stoppedAt: new Date().toISOString() } ).where( eq( runsTable.id, runId ) );

  const latencyScore = Math.max( 0, 100 - metrics.latency.p99 / 10 );
  const throughputScore = Math.min( 100, metrics.tpsSustained * 10 );
  const existingEntry = await db
    .select()
    .from( leaderboardEntriesTable )
    .where( and( eq( leaderboardEntriesTable.challengeId, run.challengeId ), eq( leaderboardEntriesTable.submissionId, run.submissionId ) ) )
    .limit( 1 );
  const entryData = {
    challengeId: run.challengeId,
    submissionId: run.submissionId,
    teamId: submission.teamId,
    score: metrics.finalScore,
    latencyScore,
    throughputScore,
    correctnessScore: metrics.correctnessScore,
    stabilityScore: metrics.stabilityScore,
    status: "live",
    updatedAt: new Date().toISOString(),
  };
  if ( existingEntry.length === 0 ) {
    await db.insert( leaderboardEntriesTable ).values( { id: crypto.randomUUID(), ...entryData } );
  } else {
    await db.update( leaderboardEntriesTable ).set( entryData ).where( eq( leaderboardEntriesTable.id, existingEntry[0]!.id ) );
  }
  return c.json( { runId, finalScore: metrics.finalScore }, 200 );
};
