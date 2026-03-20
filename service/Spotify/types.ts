import { TrackArtistRole } from "@db/types";

export interface ArtistWithRole {
  name: string;
  role: TrackArtistRole;
}

interface SpotifyArtist {
  name: string;
  id: string;
}

interface SpotifyAlbum {
  name: string;
  id: string;
  release_date: string;
}

export interface SearchResponse {
  tracks: {
    limit: number;
    offset: number;
    total: number;
    items: {
      album: SpotifyAlbum;
      artists: SpotifyArtist[];
    }
  }
}