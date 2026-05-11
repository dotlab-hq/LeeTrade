import {
  getChallengeLeaderboardHandler,
  getChallengeLeaderboardRoute,
} from "@/controllers/leaderboard.controllers/getChallengeLeaderboard.controller";
import type { AppEnv } from "@/types/app-env";
import { OpenAPIHono } from "@hono/zod-openapi";

const leaderboardRouter = new OpenAPIHono<AppEnv>();

leaderboardRouter.openapi(getChallengeLeaderboardRoute, getChallengeLeaderboardHandler);

export { leaderboardRouter };
