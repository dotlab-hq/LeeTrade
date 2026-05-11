import type { OpenAPIHono } from "@hono/zod-openapi";

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
};

export type SessionData = {
  user: SessionUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
};

export type AppEnv = {
  Variables: {
    authSession: SessionData;
  };
};

export type AppOpenAPI = OpenAPIHono<AppEnv>;
