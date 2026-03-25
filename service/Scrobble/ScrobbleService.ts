import AlbumService from "@service/Album/AlbumService";
import { db } from "@/db";
import { scrobbles } from "@db/schema";
import { parseArtists } from "@lib/parser/artist-parser";
import ArtistService from "@service/Artist/ArtistService";
import { ScrobbleRequest } from "@service/Scrobble/types";
import SpotifyService from "@service/Spotify/SpotifyService";
import TrackService from "@service/Track/TrackService";
import dayjs from "dayjs";

class ScrobbleService {
  async create(request: ScrobbleRequest) {
    const { title, artist } = request;
    const parsedArtists = parseArtists(title, artist);
    const externalIds = await new SpotifyService().matchArtist(title, parsedArtists);

    return db.transaction(async (tx) => {
      const artists = await new ArtistService(tx).resolveMany(
        parsedArtists.map((artist, i) => ({ ...artist, externalId: externalIds[i] }))
      );
      const artistsWithRole = artists.map((a, i) => ({ ...a, role: parsedArtists[i].role }))
      const album = await new AlbumService(tx).findOrCreate({
        title: request.album,
        /** TODO:ksh: multiple artist인 경우? - 2026.03.20 */
        artists: artistsWithRole,
      });
      const track = await new TrackService(tx).findOrCreate({
        title,
        albumId: album.id,
        durationSec: request.durationSec,
        artists: artistsWithRole,
      });

      const [inserted] = await tx.insert(scrobbles).values({
        userId: request.userId,
        trackId: track.id,
        playedAt: dayjs(request.playedAt).toDate(),
      })
        .returning();
      return inserted;
    });
  }
}

export default ScrobbleService;
