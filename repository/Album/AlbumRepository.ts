import { Tx } from "@/types/db";
import { albums } from "@db/schema";
import { albumArtists } from "@db/schema";
import { AlbumArtistInsert, AlbumInsert } from "@db/types";
import { and, eq, exists, inArray } from "drizzle-orm";

class AlbumRepository {
  #tx: Tx;

  constructor(tx: Tx) {
    this.#tx = tx;
  }

  async findByTitleAndArtistIds(title: string, artistIds: string[]) {
    /** TODO:ksh: "Song A - ArtistA"가 있을 때, "Song A(feat. Artist B) - Artist A"로 스크로블이 들어오는 경우 - 2026.03.25 */
    return this.#tx.query.albums.findFirst({
      where: and(
        eq(albums.title, title),
        exists(
          this.#tx.select().from(albumArtists).where(
            and(
              eq(albumArtists.albumId, albums.id),
              inArray(albumArtists.artistId, artistIds),
            ),
          ),
        ),
      ),
    });
  }

  async insert(values: AlbumInsert) {
    const [inserted] = await this.#tx.insert(albums).values(values).returning();
    return inserted;
  }

  async insertArtists(values: AlbumArtistInsert[]) {
    await this.#tx.insert(albumArtists).values(values);
  }
}

export default AlbumRepository;