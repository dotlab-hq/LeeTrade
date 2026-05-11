import "dotenv/config";
import * as schema from "@/db/schema";

import { drizzle } from 'drizzle-orm/bun-sqlite';
export const db = drizzle( process.env.DB_FILE_NAME!, {
  schema
} );

// console.log( `Database : ${JSON.stringify( db._,null,2 )}` )