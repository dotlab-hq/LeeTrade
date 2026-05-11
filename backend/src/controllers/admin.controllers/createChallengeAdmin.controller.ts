import { challengesTable } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { ChallengeDefinitionInputSchema, IdSchema } from "@/schemas/platform";
import type { AppEnv } from "@/types/app-env";
import { toJsonString } from "@/utils/json";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

export const createChallengeRoute = createRoute( {
  method: "post",
  path: "/challenges",
  tags: ["Admin"],
  summary: "Create challenge definition",
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: ChallengeDefinitionInputSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Challenge created",
      content: {
        "application/json": {
          schema: z.object( { id: IdSchema, slug: z.string(), published: z.boolean() } ),
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z.object( { error: z.string() } ),
        },
      },
    },
  },
} );

export const createChallengeHandler: RouteHandler<typeof createChallengeRoute, AppEnv> = async ( c ) => {
  const body = c.req.valid( "json" );
  const session = await auth.api.getSession( { headers: c.req.raw.headers } );
  if ( !session ) {
    return c.json( { error: "Unauthorized" }, 401 );
  }
  const challengeId = crypto.randomUUID();
  await db.insert( challengesTable ).values( {
    id: challengeId,
    slug: body.slug,
    title: body.title,
    kind: body.kind,
    protocol: body.protocol,
    version: body.version,
    definition: toJsonString( body ),
    published: false,
    createdBy: session.user.id,
  } );
  return c.json( { id: challengeId, slug: body.slug, published: false }, 201 );
};
