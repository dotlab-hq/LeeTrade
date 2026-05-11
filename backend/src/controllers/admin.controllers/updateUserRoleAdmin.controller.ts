import { roleSchema } from "@/controllers/admin.controllers/shared";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { requireRoles } from "@/middlewares/auth.middleware";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";

const userRoleBodySchema = z.object({ role: roleSchema });
const userIdParamSchema = z.object({
  userId: z.string().openapi({ param: { name: "userId", in: "path" } }),
});

export const updateUserRoleRoute = createRoute({
  method: "put",
  path: "/users/{userId}/role",
    tags: ["User Management"], 
    summary: "Update a user's role",
  security: [{ Bearer: [] }],
  request: {
    params: userIdParamSchema,
    body: {
      required: true,
      content: {
        "application/json": { schema: userRoleBodySchema },
      },
    },
  },
  middleware: [requireRoles(["admin"])] as const,
  responses: {
    200: {
      description: "Role updated",
      content: {
        "application/json": {
          schema: z.object({
            user: z.object({
              id: z.string(),
              role: roleSchema,
            }),
          }),
        },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": {
          schema: z.object({ error: z.string() }),
        },
      },
    },
  },
});

export const updateUserRoleHandler: RouteHandler<typeof updateUserRoleRoute> = async (c) => {
  const { userId } = c.req.valid("param");
  const { role } = c.req.valid("json");
  const rows = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (rows.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }
  await db.update(usersTable).set({ role }).where(eq(usersTable.id, userId));
  return c.json({ user: { id: userId, role } }, 200);
};
