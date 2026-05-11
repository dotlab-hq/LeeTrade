import { submissionsTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { parseJson } from "@/utils/json";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const submissionIdParamSchema = z.object( {
  id: z.string().uuid().openapi( { param: { name: "id", in: "path" } } ),
} );

export const getSubmissionRoute = createRoute( {
  method: "get",
  path: "/{id}",
  tags: ["Submissions"],
  summary: "Get submission details",
  security: [{ Bearer: [] }],
  request: { params: submissionIdParamSchema },
  responses: {
    200: {
      description: "Submission details",
      content: {
        "application/json": {
          schema: z.object( {
            id: z.string().uuid(),
            teamId: z.string().uuid(),
            challengeId: z.string().uuid(),
            status: z.string(),
            submittedAt: z.string(),
            manifest: z.record( z.string(), z.any() ),
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

export const getSubmissionHandler: RouteHandler<typeof getSubmissionRoute, AppEnv> = async ( c ) => {
  const { id } = c.req.valid( "param" );
  const rows = await db.select().from( submissionsTable ).where( eq( submissionsTable.id, id ) ).limit( 1 );
  const submission = rows[0];
  if ( !submission ) {
    return c.json( { error: "Submission not found" }, 404 );
  }
  return c.json(
    {
      id: submission.id,
      teamId: submission.teamId,
      challengeId: submission.challengeId,
      status: submission.status,
      submittedAt: submission.submittedAt,
      manifest: parseJson<Record<string, unknown>>( submission.manifest, {} ),
    },
    200
  );
};
