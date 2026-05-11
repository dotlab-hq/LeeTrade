import { submissionsTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { parseJson } from "@/utils/json";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const submissionIdParamSchema = z.object( {
  id: z.string().uuid().openapi( { param: { name: "id", in: "path" } } ),
} );

export const getSubmissionBuildLogsRoute = createRoute( {
  method: "get",
  path: "/submissions/{id}/build-logs",
  tags: ["Admin"],
  summary: "Get submission build logs",
  security: [{ Bearer: [] }],
  request: { params: submissionIdParamSchema },
  responses: {
    200: {
      description: "Build logs",
      content: {
        "application/json": {
          schema: z.object( {
            submissionId: z.string().uuid(),
            logs: z.array( z.object( { ts: z.string(), message: z.string() } ) ),
          } ),
        },
      },
    },
    404: {
      description: "Submission not found",
      content: { "application/json": { schema: z.object( { error: z.string() } ) } },
    },
  },
} );

export const getSubmissionBuildLogsHandler: RouteHandler<typeof getSubmissionBuildLogsRoute, AppEnv> = async ( c ) => {
  const { id } = c.req.valid( "param" );
  const rows = await db.select().from( submissionsTable ).where( eq( submissionsTable.id, id ) ).limit( 1 );
  const submission = rows[0];
  if ( !submission ) {
    return c.json( { error: "Submission not found" }, 404 );
  }
  return c.json( { submissionId: id, logs: parseJson( submission.logs, [] ) }, 200 );
};
