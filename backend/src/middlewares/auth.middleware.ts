import { auth } from "@/lib/auth";
import type { AppEnv, SessionData } from "@/types/app-env";
import type { MiddlewareHandler } from "hono";

export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  c.set("authSession", session as SessionData);
  await next();
};

export const requireRoles = (roles: string[]): MiddlewareHandler<AppEnv> => {
  return async (c, next) => {
    const session = c.get("authSession");
    const role = session.user.role ?? "viewer";
    if (!roles.includes(role)) {
      return c.json({ error: "Forbidden" }, 403);
    }
    await next();
  };
};
