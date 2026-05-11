import { db } from "@/db";
import { telemetryEventsTable } from "@/db/schema";
import { TelemetryEventSchema } from "@/schemas/platform";
import { isTelemetryType } from "@/services/scoring.service";
import type { AppEnv } from "@/types/app-env";
import { toJsonString } from "@/utils/json";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";

export const ingestTelemetryRoute = createRoute({
  method: "post",
  path: "/ingest",
  tags: ["Telemetry"],
  summary: "Ingest telemetry event",
  security: [{ Bearer: [] }],
  request: {
    body: {
      required: true,
      content: { "application/json": { schema: TelemetryEventSchema } },
    },
  },
  responses: {
    201: {
      description: "Telemetry event ingested",
      content: { "application/json": { schema: z.object({ eventId: z.string().uuid(), ingested: z.boolean() }) } },
    },
    400: {
      description: "Invalid telemetry type",
      content: { "application/json": { schema: z.object({ error: z.string() }) } },
    },
  },
});

export const ingestTelemetryHandler: RouteHandler<typeof ingestTelemetryRoute, AppEnv> = async (c) => {
  const event = c.req.valid("json");
  if (!isTelemetryType(event.type)) {
    return c.json({ error: "Invalid telemetry type" }, 400);
  }
  await db.insert(telemetryEventsTable).values({
    eventId: event.eventId,
    runId: event.runId,
    submissionId: event.submissionId,
    botId: event.botId,
    requestId: event.requestId,
    type: event.type,
    ts: event.ts,
    latencyMs: event.latencyMs,
    statusCode: event.statusCode,
    message: event.message,
    metadata: toJsonString(event.metadata),
  });
  return c.json({ eventId: event.eventId, ingested: true }, 201);
};
