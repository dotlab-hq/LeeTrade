import "dotenv/config";
import app from "@/index";

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

console.log(`Starting server on port ${port}...`);

Bun.serve({
  fetch: app.fetch,
  port,
});
