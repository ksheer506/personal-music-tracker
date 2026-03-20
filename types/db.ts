import { db } from "@db/index";

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];