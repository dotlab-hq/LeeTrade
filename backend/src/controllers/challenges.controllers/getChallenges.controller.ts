import { challengesTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

export const getChallengesRoute = createRoute( {
    method: "get",
    path: "/",
    tags: ["Challenges"],
    summary: "List published challenges",
    responses: {
        200: {
            description: "List of challenges",
            content: {
                "application/json": {
                    schema: z.object( {
                        challenges: z.array(
                            z.object( {
                                id: z.string(),
                                title: z.string(),
                                kind: z.string(),
                                slug: z.string(),
                            } )
                        ),
                    } ),
                },
            },
        },
    },
} );

export const getChallengesHandler: RouteHandler<typeof getChallengesRoute, AppEnv> = async ( c ) => {
    const rows = await db.select().from( challengesTable ).where( eq( challengesTable.published, true ) );
    const challenges = rows.map( ( r ) => ( { id: r.id, title: r.title, kind: r.kind, slug: r.slug } ) );
    return c.json( { challenges }, 200 );
};
