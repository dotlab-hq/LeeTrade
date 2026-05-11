import { ingestTelemetryHandler, ingestTelemetryRoute } from "@/controllers/telemetry.controllers/ingestTelemetry.controller";
import { requireAuth, requireRoles } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/types/app-env";
import { OpenAPIHono } from "@hono/zod-openapi";

const telemetryRouter = new OpenAPIHono<AppEnv>();

telemetryRouter.use("*", requireAuth, requireRoles(["admin"]));
telemetryRouter.openapi(ingestTelemetryRoute, ingestTelemetryHandler);

export { telemetryRouter };
