import { buildOrchestratorHandler, buildOrchestratorRoute } from "@/controllers/orchestrator.controllers/buildOrchestrator.controller";
import {
  deployOrchestratorHandler,
  deployOrchestratorRoute,
} from "@/controllers/orchestrator.controllers/deployOrchestrator.controller";
import { runOrchestratorHandler, runOrchestratorRoute } from "@/controllers/orchestrator.controllers/runOrchestrator.controller";
import { requireAuth, requireRoles } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/types/app-env";
import { OpenAPIHono } from "@hono/zod-openapi";

const orchestratorRouter = new OpenAPIHono<AppEnv>();

orchestratorRouter.use("*", requireAuth, requireRoles(["admin"]));
orchestratorRouter.openapi(buildOrchestratorRoute, buildOrchestratorHandler);
orchestratorRouter.openapi(deployOrchestratorRoute, deployOrchestratorHandler);
orchestratorRouter.openapi(runOrchestratorRoute, runOrchestratorHandler);

export { orchestratorRouter };
