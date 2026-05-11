import { runsTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const runIdParamSchema = z.object( {
  runId: z.string().uuid().openapi( { param: { name: "runId", in: "path" } } ),
} );

export const stopRunRoute = createRoute( {
  method: "post",
  path: "/runs/{runId}/stop",
  tags: ["Admin"],
  summary: "Stop a run",
  security: [{ Bearer: [] }],
  request: { params: runIdParamSchema },
  responses: {
    200: {
      description: "Run stopped",
      content: {
        "application/json": {
          schema: z.object( { runId: z.string().uuid(), status: z.string() } ),
        },
      },
    },
    404: {
      description: "Run not found",
      content: {
        "application/json": { schema: z.object( { error: z.string() } ) },
      },
    },
  },
} );

export const stopRunHandler: RouteHandler<typeof stopRunRoute, AppEnv> = async ( c ) => {
  const { runId } = c.req.valid( "param" );
  const run = await db.select( { id: runsTable.id } ).from( runsTable ).where( eq( runsTable.id, runId ) ).limit( 1 );
  if ( run.length === 0 ) {
    return c.json( { error: "Run not found" }, 404 );
  }
  await db
    .update( runsTable )
    .set( { status: "completed", stoppedAt: new Date().toISOString() } )
    .where( eq( runsTable.id, runId ) );
  return c.json( { runId, status: "completed" }, 200 );
};
