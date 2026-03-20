import { Artist, TrackArtist } from "@db/types";

export interface TrackCreateRequest {
  name: string;
  albumId?: string;
  rawArtist: string;
  artists: (Artist & Pick<TrackArtist, "role">)[];
}