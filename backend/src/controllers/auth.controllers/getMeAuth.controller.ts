import { createRoute, z } from "@hono/zod-openapi";
import type { AppEnv } from "@/types/app-env";
import type { Context } from "hono";

const meResponseSchema = z
  .object({
    session: z.object({
      id: z.string(),
      userId: z.string(),
      expiresAt: z.string().datetime(),
    }),
    user: z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string().nullable().optional(),
      role: z.string().nullable().optional(),
    }),
  })
  .openapi("MeResponse");

export const getMeRoute = createRoute({
  method: "get",
  path: "/me",
  tags: ["Authentication"],
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: "Current authenticated session",
      content: {
        "application/json": {
          schema: meResponseSchema,
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
    },
  },
});

export const getMeHandler = async (c: Context<AppEnv>) => {
  const session = c.get("authSession");
  return c.json(
    {
      session: {
        ...session.session,
        expiresAt: session.session.expiresAt.toISOString(),
      },
      user: session.user,
    },
    200
  );
};
