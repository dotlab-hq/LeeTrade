import { runsTable, telemetryEventsTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { parseJson } from "@/utils/json";
import { asc, eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const runIdParamSchema = z.object( {
  runId: z.string().uuid().openapi( { param: { name: "runId", in: "path" } } ),
} );

export const getRunTelemetryRoute = createRoute( {
  method: "get",
  path: "/runs/{runId}/telemetry",
  tags: ["Admin"],
  summary: "Get run telemetry events and metrics",
  security: [{ Bearer: [] }],
  request: { params: runIdParamSchema },
  responses: {
    200: {
      description: "Run telemetry",
      content: {
        "application/json": {
          schema: z.object( {
            runId: z.string().uuid(),
            metrics: z.record( z.string(), z.any() ),
            events: z.array(
              z.object( {
                eventId: z.string().uuid(),
                type: z.string(),
                ts: z.string(),
                message: z.string().nullable().optional(),
              } )
            ),
          } ),
        },
      },
    },
    404: {
      description: "Run not found",
      content: { "application/json": { schema: z.object( { error: z.string() } ) } },
    },
  },
} );

export const getRunTelemetryHandler: RouteHandler<typeof getRunTelemetryRoute, AppEnv> = async ( c ) => {
  const { runId } = c.req.valid( "param" );
  const runRows = await db.select().from( runsTable ).where( eq( runsTable.id, runId ) ).limit( 1 );
  const run = runRows[0];
  if ( !run ) {
    return c.json( { error: "Run not found" }, 404 );
  }
  const events = await db
    .select( {
      eventId: telemetryEventsTable.eventId,
      type: telemetryEventsTable.type,
      ts: telemetryEventsTable.ts,
      message: telemetryEventsTable.message,
    } )
    .from( telemetryEventsTable )
    .where( eq( telemetryEventsTable.runId, runId ) )
    .orderBy( asc( telemetryEventsTable.ts ) );
  return c.json( { runId, metrics: parseJson( run.metrics, {} ), events }, 200 );
};
