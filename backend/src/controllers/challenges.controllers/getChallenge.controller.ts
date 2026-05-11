import { challengesTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const idParam = z.object( { id: z.string().openapi( { param: { name: "id", in: "path" } } ) } );

export const getChallengeRoute = createRoute( {
    method: "get",
    path: "/{id}",
    tags: ["Challenges"],
    summary: "Get challenge by id",
    request: { params: idParam },
    responses: {
        200: {
            description: "Challenge detail",
            content: {
                "application/json": {
                    schema: z.object( {
                        id: z.string(),
                        title: z.string(),
                        kind: z.string(),
                        slug: z.string(),
                        protocol: z.string(),
                        version: z.number().int(),
                        definition: z.string(),
                        published: z.boolean(),
                        createdBy: z.string(),
                        createdAt: z.string(),
                    } ),
                },
            },
        },
        404: {
            description: "Not found",
            content: { "application/json": { schema: z.object( { error: z.string() } ) } },
        },
    },
} );

export const getChallengeHandler: RouteHandler<typeof getChallengeRoute, AppEnv> = async ( c ) => {
    const { id } = c.req.valid( "param" );
    const rows = await db.select().from( challengesTable ).where( eq( challengesTable.id, id ) );
    const row = rows[0];
    if ( !row ) return c.json( { error: "Not found" }, 404 );
    return c.json(
        {
            id: row.id,
            title: row.title,
            kind: row.kind,
            slug: row.slug,
            protocol: row.protocol,
            version: row.version,
            definition: row.definition,
            published: row.published,
            createdBy: row.createdBy,
            createdAt: row.createdAt,
        },
        200
    );
};
