import { runsTable, submissionsTable } from "@/db/schema";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import type { AppEnv } from "@/types/app-env";
import { toJsonString } from "@/utils/json";
import { eq } from "drizzle-orm";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

const runBodySchema = z.object({
  submissionId: z.string().uuid(),
  challengeId: z.string().uuid(),
});

export const runOrchestratorRoute = createRoute({
  method: "post",
  path: "/run",
  tags: ["Orchestrator"],
  summary: "Create benchmark run",
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: runBodySchema } },
    },
  },
  responses: {
    201: {
      description: "Run created",
      content: { "application/json": { schema: z.object({ runId: z.string().uuid(), status: z.string() }) } },
    },
    404: {
      description: "Submission not found",
      content: { "application/json": { schema: z.object({ error: z.string() }) } },
    },
    401: {
      description: "Unauthorized",
      content: { "application/json": { schema: z.object({ error: z.string() }) } },
    },
  },
});

export const runOrchestratorHandler: RouteHandler<typeof runOrchestratorRoute, AppEnv> = async (c) => {
  const body = c.req.valid("json");
  const submission = await db
    .select({ id: submissionsTable.id })
    .from(submissionsTable)
    .where(eq(submissionsTable.id, body.submissionId))
    .limit(1);
  if (submission.length === 0) {
    return c.json({ error: "Submission not found" }, 404);
  }
  const runId = crypto.randomUUID();
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await db.insert(runsTable).values({
    id: runId,
    submissionId: body.submissionId,
    challengeId: body.challengeId,
    status: "queued",
    metrics: toJsonString({}),
    buildLogs: toJsonString([{ ts: new Date().toISOString(), message: "Run queued" }]),
    createdBy: session.user.id,
  });
  return c.json({ runId, status: "queued" }, 201);
};
