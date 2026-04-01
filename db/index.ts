import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";
import * as relations from "./relations";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", (client) => {
  client.query("SET timezone = 'Asia/Seoul'");
});

export const db = drizzle(pool, { schema: { ...schema, ...relations } });
