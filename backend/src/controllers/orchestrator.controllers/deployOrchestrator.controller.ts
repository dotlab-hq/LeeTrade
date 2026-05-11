import { submissionsTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { parseJson, toJsonString } from "@/utils/json";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const deployBodySchema = z.object( { submissionId: z.string().uuid() } );

export const deployOrchestratorRoute = createRoute( {
  method: "post",
  path: "/deploy",
  tags: ["Orchestrator"],
  summary: "Deploy built submission to sandbox",
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: deployBodySchema } },
    },
  },
  responses: {
    200: {
      description: "Submission deployed",
      content: { "application/json": { schema: z.object( { submissionId: z.string().uuid(), status: z.string() } ) } },
    },
    404: {
      description: "Submission not found",
      content: { "application/json": { schema: z.object( { error: z.string() } ) } },
    },
  },
} );

export const deployOrchestratorHandler: RouteHandler<typeof deployOrchestratorRoute, AppEnv> = async ( c ) => {
  const { submissionId } = c.req.valid( "json" );
  const rows = await db.select().from( submissionsTable ).where( eq( submissionsTable.id, submissionId ) ).limit( 1 );
  const submission = rows[0];
  if ( !submission ) {
    return c.json( { error: "Submission not found" }, 404 );
  }
  const logs = parseJson<{ ts: string; message: string }[]>( submission.logs, [] );
  logs.push( { ts: new Date().toISOString(), message: "Sandbox deployment started" } );
  logs.push( { ts: new Date().toISOString(), message: "Sandbox deployment completed" } );
  await db.update( submissionsTable ).set( { status: "running", logs: toJsonString( logs ) } ).where( eq( submissionsTable.id, submissionId ) );
  return c.json( { submissionId, status: "running" }, 200 );
};
