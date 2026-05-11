import {
  createChallengeHandler,
  createChallengeRoute,
} from "@/controllers/admin.controllers/createChallengeAdmin.controller";
import {
  getRunTelemetryHandler,
  getRunTelemetryRoute,
} from "@/controllers/admin.controllers/getRunTelemetryAdmin.controller";
import {
  getSubmissionBuildLogsHandler,
  getSubmissionBuildLogsRoute,
} from "@/controllers/admin.controllers/getSubmissionBuildLogsAdmin.controller";
import {
  listContainersHandler,
  listContainersRoute,
} from "@/controllers/admin.controllers/listContainersAdmin.controller";
import { listUsersHandler, listUsersRoute } from "@/controllers/admin.controllers/listUsersAdmin.controller";
import {
  publishChallengeHandler,
  publishChallengeRoute,
} from "@/controllers/admin.controllers/publishChallengeAdmin.controller";
import {
  resetSystemHandler,
  resetSystemRoute,
} from "@/controllers/admin.controllers/resetSystemAdmin.controller";
import {
  startRunHandler,
  startRunRoute,
} from "@/controllers/admin.controllers/startRunAdmin.controller";
import {
  stopRunHandler,
  stopRunRoute,
} from "@/controllers/admin.controllers/stopRunAdmin.controller";
import {
  updateUserRoleHandler,
  updateUserRoleRoute,
} from "@/controllers/admin.controllers/updateUserRoleAdmin.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/types/app-env";
import { OpenAPIHono } from "@hono/zod-openapi";

const adminRouter = new OpenAPIHono<AppEnv>();

adminRouter.use("*", requireAuth);
adminRouter.openapi(listUsersRoute, listUsersHandler);
adminRouter.openapi(updateUserRoleRoute, updateUserRoleHandler);
adminRouter.openapi(listContainersRoute, listContainersHandler);
adminRouter.openapi(createChallengeRoute, createChallengeHandler);
adminRouter.openapi(publishChallengeRoute, publishChallengeHandler);
adminRouter.openapi(startRunRoute, startRunHandler);
adminRouter.openapi(stopRunRoute, stopRunHandler);
adminRouter.openapi(getRunTelemetryRoute, getRunTelemetryHandler);
adminRouter.openapi(getSubmissionBuildLogsRoute, getSubmissionBuildLogsHandler);
adminRouter.openapi(resetSystemRoute, resetSystemHandler);

export { adminRouter };
