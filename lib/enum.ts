import { PgEnum } from "drizzle-orm/pg-core";

export const toEnumValues = <V extends [string, ...string[]]>(enumDef: PgEnum<V>) =>
  Object.freeze(
    Object.fromEntries(enumDef.enumValues.map((v) => [v, v])) as unknown as { [K in V[number]]: K },
  );
