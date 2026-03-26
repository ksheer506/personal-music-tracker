import { Tx } from "@/types/db";
import { albums } from "@db/schema";
import { albumArtists } from "@db/schema";
import { AlbumArtistInsert, AlbumArtistRole, AlbumInsert } from "@db/types";
import { and, eq, exists, inArray } from "drizzle-orm";

class AlbumRepository {
  #tx: Tx;

  constructor(tx: Tx) {
    this.#tx = tx;
  }

  async findByExternalId(externalId: string) {
    return this.#tx.query.albums.findFirst({
      where: eq(albums.externalId, externalId),
      with: { albumArtists: true },
    });
  }

  async findManyByTitleAndArtistIds(title: string, artistIds: string[]) {
    return this.#tx.query.albums.findMany({
      where: and(
        eq(albums.title, title),
        exists(this.#tx.select().from(albumArtists).where(
          and(
            eq(albumArtists.albumId, albums.id),
            inArray(albumArtists.artistId, artistIds),
          ),
        )),
      ),
      with: { albumArtists: true },
    });
  }

  async insert(values: AlbumInsert) {
    const [inserted] = await this.#tx.insert(albums).values(values).returning();
    return inserted;
  }

  async insertArtists(values: AlbumArtistInsert[]) {
    await this.#tx.insert(albumArtists).values(values);
  }

  async updateArtistRoles(albumId: string, artistIds: string[], role: AlbumArtistRole) {
    await this.#tx.update(albumArtists)
      .set({ role })
      .where(and(
        eq(albumArtists.albumId, albumId),
        inArray(albumArtists.artistId, artistIds),
      ));
  }
}

export default AlbumRepository;