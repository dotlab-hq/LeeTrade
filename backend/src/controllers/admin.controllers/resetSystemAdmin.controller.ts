import { challengesTable, leaderboardEntriesTable, runsTable, submissionsTable, telemetryEventsTable } from "@/db/schema";
import { db } from "@/db";
import { dockerService } from "@/services/docker.service";
import type { AppEnv } from "@/types/app-env";
import { count } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

export const resetSystemRoute = createRoute( {
  method: "post",
  path: "/system/reset",
  tags: ["Admin"],
  summary: "Reset platform state and cleanup managed runtime containers",
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "System reset complete",
      content: {
        "application/json": {
          schema: z.object( {
            ok: z.boolean(),
            deleted: z.object( {
              challenges: z.number().int().nonnegative(),
              submissions: z.number().int().nonnegative(),
              runs: z.number().int().nonnegative(),
              telemetryEvents: z.number().int().nonnegative(),
              leaderboardEntries: z.number().int().nonnegative(),
            } ),
            removedContainers: z.number().int().nonnegative(),
          } ),
        },
      },
    },
  },
} );

export const resetSystemHandler: RouteHandler<typeof resetSystemRoute, AppEnv> = async ( c ) => {
  const [challengeCountRows, submissionCountRows, runCountRows, telemetryCountRows, leaderboardCountRows] = await Promise.all( [
    db.select( { value: count() } ).from( challengesTable ),
    db.select( { value: count() } ).from( submissionsTable ),
    db.select( { value: count() } ).from( runsTable ),
    db.select( { value: count() } ).from( telemetryEventsTable ),
    db.select( { value: count() } ).from( leaderboardEntriesTable ),
  ] );
  await Promise.all( [
    db.delete( leaderboardEntriesTable ),
    db.delete( telemetryEventsTable ),
    db.delete( runsTable ),
    db.delete( submissionsTable ),
    db.delete( challengesTable ),
  ] );
  const removedContainers = await dockerService.cleanupManagedContainers();
  return c.json(
    {
      ok: true,
      deleted: {
        challenges: challengeCountRows[0]?.value ?? 0,
        submissions: submissionCountRows[0]?.value ?? 0,
        runs: runCountRows[0]?.value ?? 0,
        telemetryEvents: telemetryCountRows[0]?.value ?? 0,
        leaderboardEntries: leaderboardCountRows[0]?.value ?? 0,
      },
      removedContainers,
    },
    200
  );
};
