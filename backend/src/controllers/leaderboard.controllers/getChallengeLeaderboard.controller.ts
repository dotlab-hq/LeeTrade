import { leaderboardEntriesTable } from "@/db/schema";
import { db } from "@/db";
import type { AppEnv } from "@/types/app-env";
import { desc, eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const challengeIdParamSchema = z.object( {
  challengeId: z.string().uuid().openapi( { param: { name: "challengeId", in: "path" } } ),
} );

export const getChallengeLeaderboardRoute = createRoute( {
  method: "get",
  path: "/{challengeId}",
  tags: ["Leaderboard"],
  summary: "Get leaderboard for challenge",
  request: { params: challengeIdParamSchema },
  responses: {
    200: {
      description: "Leaderboard entries",
      content: {
        "application/json": {
          schema: z.object( {
            challengeId: z.string().uuid(),
            entries: z.array(
              z.object( {
                rank: z.number().int().positive(),
                submissionId: z.string().uuid(),
                teamId: z.string().uuid(),
                score: z.number(),
                status: z.string(),
                updatedAt: z.string(),
              } )
            ),
          } ),
        },
      },
    },
  },
} );

export const getChallengeLeaderboardHandler: RouteHandler<typeof getChallengeLeaderboardRoute, AppEnv> = async ( c ) => {
  const { challengeId } = c.req.valid( "param" );
  const rows = await db
    .select()
    .from( leaderboardEntriesTable )
    .where( eq( leaderboardEntriesTable.challengeId, challengeId ) )
    .orderBy( desc( leaderboardEntriesTable.score ), desc( leaderboardEntriesTable.updatedAt ) );

  const entries = rows.map( ( row, index ) => ( {
    rank: index + 1,
    submissionId: row.submissionId,
    teamId: row.teamId,
    score: row.score,
    status: row.status,
    updatedAt: row.updatedAt,
  } ) );
  return c.json( { challengeId, entries }, 200 );
};
