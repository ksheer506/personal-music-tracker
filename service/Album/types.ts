import { AlbumInsert, ArtistWithRole } from "@db/types";

export interface AlbumCreateRequest extends AlbumInsert {
  artists: ArtistWithRole[];
}