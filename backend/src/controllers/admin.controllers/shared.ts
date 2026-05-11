import { z } from "@hono/zod-openapi";

export const roleSchema = z.enum(["admin", "organizer", "judge", "contestant", "viewer"]);
