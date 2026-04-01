import { artists } from "@db/schema";
import { eq } from "drizzle-orm";
import { Tx } from "@/types/db";
import { ArtistInsert } from "@db/types";

class ArtistRepository {
  #tx: Tx;

  constructor(tx: Tx) {
    this.#tx = tx;
  }

  async findManyByExternalIdOrName(externalIds: string[], names: string[]) {
    return this.#tx.query.artists.findMany({
      where: (artists, op) =>
        op.or(
          externalIds.length > 0
            ? op.inArray(artists.externalId, externalIds)
            : undefined,
          names.length > 0
            ? op.inArray(artists.name, names)
            : undefined,
        ),
    });
  }

  async findByExternalId(externalId: string) {
    return this.#tx.query.artists.findFirst({
      where: eq(artists.externalId, externalId),
    });
  }

  async findByName(name: string) {
    return this.#tx.query.artists.findFirst({
      where: eq(artists.name, name),
    });
  }

  async updateExternalId(id: string, externalId: string | null) {
    await this.#tx.update(artists).set({ externalId }).where(eq(artists.id, id));
  }

  async insertMany(values: ArtistInsert[]) {
    if (values.length === 0) {
      return [];
    }
    return this.#tx
      .insert(artists)
      .values(values)
      .returning();
  }
}

export default ArtistRepository;
