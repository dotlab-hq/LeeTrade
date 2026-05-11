import { roleSchema } from "@/controllers/admin.controllers/shared";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { requireRoles } from "@/middlewares/auth.middleware";
import { createRoute, type RouteHandler, z } from "@hono/zod-openapi";
import { count } from "drizzle-orm";

const usersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({ param: { name: "page", in: "query" } }),
  pageSize: z.coerce.number().int().min(1).max(100).default(20).openapi({ param: { name: "pageSize", in: "query" } }),
});

export const listUsersRoute = createRoute({
  method: "get",
  path: "/users",
  tags: ["User Management"], 
  summary: "List users",
  security: [{ Bearer: [] }],
  request: { query: usersQuerySchema },
  middleware: [requireRoles(["admin"])] as const,
  responses: {
    200: {
      description: "Paginated users",
      content: {
        "application/json": {
          schema: z.object({
            users: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                email: z.string().email(),
                role: roleSchema,
              })
            ),
            page: z.number().int(),
            pageSize: z.number().int(),
            total: z.number().int(),
            pageCount: z.number().int(),
          }),
        },
      },
    },
  },
});

export const listUsersHandler: RouteHandler<typeof listUsersRoute> = async (c) => {
  const { page, pageSize } = c.req.valid("query");
  const offset = (page - 1) * pageSize;
  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
    })
    .from(usersTable)
    .limit(pageSize)
    .offset(offset);
  const totalRows = await db.select({ value: count() }).from(usersTable);
  const total = totalRows[0]?.value ?? 0;
  const pageCount = total === 0 ? 0 : Math.ceil(total / pageSize);
  const typedUsers = users.map((user) => ({
    ...user,
    role: roleSchema.parse(user.role),
  }));
  return c.json({ users: typedUsers, page, pageSize, total, pageCount }, 200);
};
