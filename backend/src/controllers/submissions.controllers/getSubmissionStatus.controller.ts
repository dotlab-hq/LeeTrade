import { submissionsTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const submissionIdParamSchema = z.object( {
  id: z.string().uuid().openapi( { param: { name: "id", in: "path" } } ),
} );

export const getSubmissionStatusRoute = createRoute( {
  method: "get",
  path: "/{id}/status",
  tags: ["Submissions"],
  summary: "Get submission status",
  security: [{ Bearer: [] }],
  request: { params: submissionIdParamSchema },
  responses: {
    200: {
      description: "Submission status",
      content: {
        "application/json": {
          schema: z.object( { id: z.string().uuid(), status: z.string() } ),
        },
      },
    },
    404: {
      description: "Submission not found",
      content: { "application/json": { schema: z.object( { error: z.string() } ) } },
    },
  },
} );

export const getSubmissionStatusHandler: RouteHandler<typeof getSubmissionStatusRoute, AppEnv> = async ( c ) => {
  const { id } = c.req.valid( "param" );
  const rows = await db
    .select( { id: submissionsTable.id, status: submissionsTable.status } )
    .from( submissionsTable )
    .where( eq( submissionsTable.id, id ) )
    .limit( 1 );
  const submission = rows[0];
  if ( !submission ) {
    return c.json( { error: "Submission not found" }, 404 );
  }
  return c.json( submission, 200 );
};
