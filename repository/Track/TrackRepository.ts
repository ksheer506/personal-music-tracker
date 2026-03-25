import { Tx } from "@/types/db";
import { trackArtists, tracks } from "@db/schema";
import { TrackArtistInsert, TrackInsert } from "@db/types";
import { and, eq, exists, inArray } from "drizzle-orm";

class TrackRepository {
  #tx: Tx;

  constructor(tx: Tx) {
    this.#tx = tx;
  }

  async findByTitleAndArtistIds(title: string, artistIds: string[]) {
    return this.#tx.query.tracks.findFirst({
      where: and(
        eq(tracks.title, title),
        exists(
          this.#tx
            .select()
            .from(trackArtists)
            .where(
              and(
                eq(trackArtists.trackId, tracks.id),
                inArray(trackArtists.artistId, artistIds),
              ),
            ),
        ),
      ),
    });
  }

  async insert(values: TrackInsert) {
    const [inserted] = await this.#tx
      .insert(tracks)
      .values(values)
      .returning();
    return inserted;
  }

  async insertArtists(values: TrackArtistInsert[]) {
    await this.#tx.insert(trackArtists).values(values);
  }
}

export default TrackRepository;