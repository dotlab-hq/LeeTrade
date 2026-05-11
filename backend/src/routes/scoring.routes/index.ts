import { computeScoringHandler, computeScoringRoute } from "@/controllers/scoring.controllers/computeScoring.controller";
import { requireAuth, requireRoles } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/types/app-env";
import { OpenAPIHono } from "@hono/zod-openapi";

const scoringRouter = new OpenAPIHono<AppEnv>();

scoringRouter.use("*", requireAuth, requireRoles(["admin"]));
scoringRouter.openapi(computeScoringRoute, computeScoringHandler);

export { scoringRouter };
