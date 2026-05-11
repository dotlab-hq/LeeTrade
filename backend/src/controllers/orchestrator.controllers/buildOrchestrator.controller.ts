import { submissionsTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { parseJson, toJsonString } from "@/utils/json";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const buildBodySchema = z.object( { submissionId: z.string().uuid() } );

export const buildOrchestratorRoute = createRoute( {
  method: "post",
  path: "/build",
  tags: ["Orchestrator"],
  summary: "Queue and mark submission build",
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: buildBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Build queued",
      content: { "application/json": { schema: z.object( { submissionId: z.string().uuid(), status: z.string() } ) } },
    },
    404: {
      description: "Submission not found",
      content: { "application/json": { schema: z.object( { error: z.string() } ) } },
    },
  },
} );

export const buildOrchestratorHandler: RouteHandler<typeof buildOrchestratorRoute, AppEnv> = async ( c ) => {
  const { submissionId } = c.req.valid( "json" );
  const rows = await db.select().from( submissionsTable ).where( eq( submissionsTable.id, submissionId ) ).limit( 1 );
  const submission = rows[0];
  if ( !submission ) {
    return c.json( { error: "Submission not found" }, 404 );
  }
  const logs = parseJson<{ ts: string; message: string }[]>( submission.logs, [] );
  logs.push( { ts: new Date().toISOString(), message: "Build queued by orchestrator" } );
  await db.update( submissionsTable ).set( { status: "build_queued", logs: toJsonString( logs ) } ).where( eq( submissionsTable.id, submissionId ) );
  return c.json( { submissionId, status: "build_queued" }, 200 );
};
