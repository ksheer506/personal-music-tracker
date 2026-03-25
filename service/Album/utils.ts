import { AlbumArtistRole, TrackArtistRole } from "@db/types";

export const getAlbumArtistRole = (role: TrackArtistRole | undefined): AlbumArtistRole | undefined => {
  switch (role) {
    case "main":
      return "main";
    case "feature":
      return "contributor";
    case "with":
      return "contributor";
    case "multiple":
      return "various";
    default:
      return "main";
  }
};