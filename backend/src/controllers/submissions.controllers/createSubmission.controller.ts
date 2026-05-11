import { challengesTable, submissionsTable } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { SubmissionUploadSchema } from "@/schemas/platform";
import type { AppEnv } from "@/types/app-env";
import { toJsonString } from "@/utils/json";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const ErrorResponseSchema = z.object( { error: z.string() } );

export const createSubmissionRoute = createRoute( {
  method: "post",
  path: "/",
  tags: ["Submissions"],
  summary: "Upload a new submission",
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: SubmissionUploadSchema },
      },
    },
  },
  responses: {
    201: {
      description: "Submission created",
      content: {
        "application/json": {
          schema: z.object( { id: z.string().uuid(), status: z.string() } ),
        },
      },
    },
    404: {
      description: "Challenge not found",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: ErrorResponseSchema } },
    },
  },
} );

export const createSubmissionHandler: RouteHandler<typeof createSubmissionRoute, AppEnv> = async ( c ) => {
  const body = c.req.valid( "json" );
  const challenge = await db
    .select( { id: challengesTable.id } )
    .from( challengesTable )
    .where( eq( challengesTable.id, body.challengeId ) )
    .limit( 1 );
  if ( challenge.length === 0 ) {
    return c.json( { error: "Challenge not found" }, 404 );
  }
  const session = await auth.api.getSession( { headers: c.req.raw.headers } );
  if ( !session ) {
    return c.json( { error: "Unauthorized" }, 401 );
  }
  const submissionId = crypto.randomUUID();
  const logs = [{ ts: new Date().toISOString(), message: "Submission received" }];
  await db.insert( submissionsTable ).values( {
    id: submissionId,
    teamId: body.teamId,
    challengeId: body.challengeId,
    userId: session.user.id,
    type: body.type,
    status: "uploaded",
    sourceUrl: body.sourceUrl,
    archiveFileName: body.archiveFileName,
    manifest: toJsonString( body.manifest ),
    declaredSha256: body.declaredSha256,
    submittedAt: body.submittedAt,
    logs: toJsonString( logs ),
  } );
  return c.json( { id: submissionId, status: "uploaded" }, 201 );
};
