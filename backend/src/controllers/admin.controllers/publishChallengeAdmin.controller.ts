import { challengesTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const challengeIdParamSchema = z.object( {
  id: z.string().uuid().openapi( { param: { name: "id", in: "path" } } ),
} );

export const publishChallengeRoute = createRoute( {
  method: "post",
  path: "/challenges/{id}/publish",
  tags: ["Admin"],
  summary: "Publish challenge",
  security: [{ Bearer: [] }],
  request: { params: challengeIdParamSchema },
  responses: {
    200: {
      description: "Challenge published",
      content: {
        "application/json": {
          schema: z.object( { id: z.string().uuid(), published: z.boolean() } ),
        },
      },
    },
    404: {
      description: "Challenge not found",
      content: {
        "application/json": { schema: z.object( { error: z.string() } ) },
      },
    },
  },
} );

export const publishChallengeHandler: RouteHandler<typeof publishChallengeRoute, AppEnv> = async ( c ) => {
  const { id } = c.req.valid( "param" );
  const existing = await db.select( { id: challengesTable.id } ).from( challengesTable ).where( eq( challengesTable.id, id ) ).limit( 1 );
  if ( existing.length === 0 ) {
    return c.json( { error: "Challenge not found" }, 404 );
  }
  await db.update( challengesTable ).set( { published: true, updatedAt: new Date().toISOString() } ).where( eq( challengesTable.id, id ) );
  return c.json( { id, published: true }, 200 );
};
