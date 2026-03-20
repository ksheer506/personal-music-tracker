import { ArtistWithRole } from "@service/Spotify/types";

export interface ArtistResolveRequest extends ArtistWithRole {
  externalId: string | null;
}