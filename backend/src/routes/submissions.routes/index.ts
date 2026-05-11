import { createSubmissionHandler, createSubmissionRoute } from "@/controllers/submissions.controllers/createSubmission.controller";
import { getSubmissionHandler, getSubmissionRoute } from "@/controllers/submissions.controllers/getSubmission.controller";
import { getSubmissionLogsHandler, getSubmissionLogsRoute } from "@/controllers/submissions.controllers/getSubmissionLogs.controller";
import {
  getSubmissionStatusHandler,
  getSubmissionStatusRoute,
} from "@/controllers/submissions.controllers/getSubmissionStatus.controller";
import { requireAuth } from "@/middlewares/auth.middleware";
import type { AppEnv } from "@/types/app-env";
import { OpenAPIHono } from "@hono/zod-openapi";

const submissionsRouter = new OpenAPIHono<AppEnv>();

submissionsRouter.use("*", requireAuth);
submissionsRouter.openapi(createSubmissionRoute, createSubmissionHandler);
submissionsRouter.openapi(getSubmissionRoute, getSubmissionHandler);
submissionsRouter.openapi(getSubmissionStatusRoute, getSubmissionStatusHandler);
submissionsRouter.openapi(getSubmissionLogsRoute, getSubmissionLogsHandler);

export { submissionsRouter };
