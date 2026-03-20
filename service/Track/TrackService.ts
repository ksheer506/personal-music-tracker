import { db } from "@db/index";
import { trackArtists, tracks } from "@db/schema";
import { TrackCreateRequest } from "@service/Track/types";
import { and, eq, exists, inArray } from "drizzle-orm";

class TrackService {
  findOrCreate(request: TrackCreateRequest) {
    const { name, albumId, rawArtist, artists } = request;

    return db.transaction(async (tx) => {
      const track = await tx.query.tracks.findFirst({
        where: and(
          eq(tracks.title, name),
          exists(
            tx.select().from(trackArtists).where(
              and(
                eq(trackArtists.trackId, tracks.id),
                inArray(trackArtists.artistId, artists.map((a) => a.id))
              )
            )
          )
        ),
      });

      if (track) {
        return track;
      }
      const inserted = await tx
        .insert(tracks)
        .values({
          title: name,
          albumId: albumId ?? null,
        })
        .returning();

      /* trackArtists N:M 처리 */
      await tx.insert(trackArtists).values(
        artists.map((artist) => ({
          trackId: inserted[0].id,
          artistId: artist.id,
          role: artist.role,
        }))
      );

      return inserted[0];
    });
  }
}

export default TrackService;