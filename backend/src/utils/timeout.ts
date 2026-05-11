import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";

export const TimeoutException = (context: Context) =>
	new HTTPException(408, {
		message: `Request timeout after waiting ${context.req.header("Duration")} seconds. Please try again later.`,
	});