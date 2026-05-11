import { auth } from "@/lib/auth";
import { adminRouter } from "@/routes/admin.routes";
import { authRouter } from "@/routes/auth.routes";
import { leaderboardRouter } from "@/routes/leaderboard.routes";
import { orchestratorRouter } from "@/routes/orchestrator.routes";
import { scoringRouter } from "@/routes/scoring.routes";
import { submissionsRouter } from "@/routes/submissions.routes";
import { telemetryRouter } from "@/routes/telemetry.routes";
import { challengesRouter } from "@/routes/challenges.routes";
import type { AppEnv } from "@/types/app-env";
import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { timeout } from "hono/timeout";
import { trimTrailingSlash } from "hono/trailing-slash";
import { GeoMiddleware, getGeo } from "hono-geo-middleware";
import { ScalarDocs } from "@/utils/scalar-docs";
import { TimeoutException } from "@/utils/timeout";
import { cors } from "hono/cors";
import { Origins } from "@/constants/Origins";

const app = new OpenAPIHono<AppEnv>( {
  defaultHook: ( result, c ) => {
    if ( !result.success ) {
      return c.json( { error: "Validation failed", details: result.error.flatten() }, 400 );
    }
  },
} );

app.use( cors( { origin: Origins, credentials: true } ) ); // CORS configuration

app.use( trimTrailingSlash() );
app.use(
  secureHeaders( {
    removePoweredBy: true,
  } ),
);
app.use( GeoMiddleware() );
app.use( requestId() );
app.use( logger() );
app.use( timeout( 5000, TimeoutException ) ); // 5 seconds timeout
app.use( prettyJSON( { space: 4 } ) );


app.openAPIRegistry.registerComponent( "securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
} );

app.get( "/health", ( c ) => c.json( { status: "ok" } ) );
app.all( "/api/auth/*", ( c ) => auth.handler( c.req.raw ) );

app.route( "/api/v1/auth", authRouter );
app.route( "/api/v1/admin", adminRouter );
app.route( "/api/v1/submissions", submissionsRouter );
app.route( "/api/v1/leaderboard", leaderboardRouter );
app.route( "/api/v1/orchestrator", orchestratorRouter );
app.route( "/api/v1/telemetry", telemetryRouter );
app.route( "/api/v1/scoring", scoringRouter );
app.route( "/api/v1/challenges", challengesRouter );


app.get( "/geo", ( c ) => c.json( getGeo( c ) ) );


app.doc( "/docs", {
  openapi: "3.0.0",
  info: {
    title: "LeeTrade Backend API",
    version: "1.0.0",
  },
} );

// You can also add Scalar docs if you want
app.get( "/", ScalarDocs );

app.notFound( ( c ) => c.json( { error: "Route not found" }, 404 ) );

export default app;
