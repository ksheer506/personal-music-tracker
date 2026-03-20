import AlbumService from "@service/Album/AlbumService";
import { db } from "@/db";
import { scrobbles } from "@db/schema";
import { parseArtists } from "@lib/parser/artist-parser";
import ArtistService from "@service/Artist/ArtistService";
import { ScrobbleRequest } from "@service/Scrobble/types";
import SpotifyService from "@service/Spotify/SpotifyService";
import TrackService from "@service/Track/TrackService";
import moment from "moment";
import { TRACK_ARTIST_ROLE } from "@db/enums";

class ScrobbleService {
  async create(request: ScrobbleRequest) {
    const { track, artist } = request;
    const parsedArtists = parseArtists(track, artist);
    const externalIds = await new SpotifyService().matchArtist(track, parsedArtists);

    return db.transaction(async (tx) => {
      const artists = await new ArtistService().resolveMany(
        parsedArtists.map((artist, i) => ({ ...artist, externalId: externalIds[i] }))
      );
      const artistsWithRole = artists.map((a, i) => ({ ...a, role: parsedArtists[i].role }))
      const mainArtist = artistsWithRole.find((a) => a.role === TRACK_ARTIST_ROLE.main);
      const album = await new AlbumService().findOrCreate({
        name: request.album,
        /** TODO:ksh: multiple artist인 경우? - 2026.03.20 */
        artistId: mainArtist?.id,
      });
      const track = await new TrackService().findOrCreate({
        name: request.track,
        albumId: album?.id,
        rawArtist: request.artist,
        artists: artistsWithRole,
      });

      await tx.insert(scrobbles).values({
        userId: request.userId,
        trackId: track.id as string,
        playedAt: moment(request.playedAt).toDate(),
      });
    });
  }
}

export default ScrobbleService;
