import { Artist, TrackArtist, TrackInsert } from "@db/types";

export interface TrackCreateRequest extends TrackInsert {
  artists: (Artist & Pick<TrackArtist, "role">)[];
}