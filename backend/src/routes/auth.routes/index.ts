import {
  getMeHandler,
  getMeRoute,
} from "@/controllers/auth.controllers/getMeAuth.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/types/app-env";
import { OpenAPIHono } from "@hono/zod-openapi";

const authRouter = new OpenAPIHono<AppEnv>();

authRouter.use("*", requireAuth);
authRouter.openapi(getMeRoute, getMeHandler);

export { authRouter };
