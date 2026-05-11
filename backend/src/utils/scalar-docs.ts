import { Scalar } from "@scalar/hono-api-reference";

const ScalarDocs = Scalar({
	pageTitle: "LeeTrade Backend API Documentation",
	sources: [
		{ url: "/docs", title: "API" },
		// Better Auth schema generation endpoint
		{ url: "/api/auth/open-api/generate-schema", title: "Auth" },
	],
});
export { ScalarDocs };