import { db } from "@/db";
import * as schema from "@/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins"
export const auth = betterAuth({
  adapter: drizzleAdapter(db, {
    provider: "postgres",
    usePlural: true,
    debugLogs: true,
    schema
  }),
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "admin",
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET ?? "development-secret",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});
