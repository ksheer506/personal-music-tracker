import AlbumService from "@service/Album/AlbumService";
import { db } from "@/db";
import { scrobbles } from "@db/schema";
import { parseArtists } from "@lib/parser/artist-parser";
import ArtistService from "@service/Artist/ArtistService";
import { ScrobbleRequest } from "@service/Scrobble/types";
import SpotifyService from "@service/Spotify/SpotifyService";
import TrackService from "@service/Track/TrackService";
import dayjs from "dayjs";
import { parseArtistExternalIds } from "@service/Artist/utils";

class ScrobbleService {
  async create(request: ScrobbleRequest) {
    const { title, artist, externalIds } = request;
    const parsedArtists = parseArtists(title, artist);
    /** TODO:ksh: parsedArtists가 둘 이상일 경우 externalId 맵핑 필요 - 2026.04.01 */
    const artistExternalIds = parseArtistExternalIds(externalIds?.artist ?? []);
    /* const externalIds: string[] = await new SpotifyService().matchArtist(title, parsedArtists); */

    return db.transaction(async (tx) => {
      const artists = await new ArtistService(tx).resolveMany(
        parsedArtists.map((a) => ({ ...a, externalId: artistExternalIds[a.name] ?? null }))
      );
      const artistsWithRole = artists.map((a, i) => ({ ...a, role: parsedArtists[i].role }))
      const album = await new AlbumService(tx).findOrCreate({
        title: request.album,
        externalId: externalIds?.album,
        artists: artistsWithRole,
      });
      const track = await new TrackService(tx).findOrCreate({
        title,
        rawArtist: artist,
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
