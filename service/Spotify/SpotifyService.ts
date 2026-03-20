import { SearchResponse, ArtistWithRole } from "@service/Spotify/types";
import { toSearchQueries } from "@service/Spotify/utils";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

class SpotifyService {
  #getAccessToken() {}

  async matchArtist(track: string, artists: string | ArtistWithRole[]) {
    const token = this.#getAccessToken();
    const data = await Promise.all(toSearchQueries(track, artists).map((query) => fetch(
      `${SPOTIFY_BASE_URL}/search?q=${encodeURIComponent(query)}&type=track&limit=6`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => res.json() as Promise<SearchResponse>)));

    return data.map((d) => {
      const { artists } = d.tracks.items

      if (artists.length === 1) {
        return artists[0].id
      }
      return null
    });

    /* 1. 결과가 없는 경우 */

    /* 2. 결과가 2개 이상인 경우 */

  }
}

export default SpotifyService;
