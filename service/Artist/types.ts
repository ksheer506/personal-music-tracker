import { ArtistWithRole } from "@service/Spotify/types";

export interface ArtistResolveRequest extends ArtistWithRole {
  externalId: string | null;
}

export interface ArtistExternalId {
  id: string;
  name: string;
}