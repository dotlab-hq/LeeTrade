import { getChallengesHandler, getChallengesRoute } from "@/controllers/challenges.controllers/getChallenges.controller";
import { getChallengeHandler, getChallengeRoute } from "@/controllers/challenges.controllers/getChallenge.controller";
import type { AppEnv } from "@/types/app-env";
import { OpenAPIHono } from "@hono/zod-openapi";

const challengesRouter = new OpenAPIHono<AppEnv>();

challengesRouter.openapi( getChallengesRoute, getChallengesHandler );
challengesRouter.openapi( getChallengeRoute, getChallengeHandler );

export { challengesRouter };
