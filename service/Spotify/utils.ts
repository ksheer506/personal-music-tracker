import { ArtistWithRole } from "@service/Spotify/types";

export const toSearchQueries = (track: string, artists: string | ArtistWithRole[]) => {
  if (typeof artists === "string") {
    return [`track:${track} artist:${artists}`]
  }
  return artists.reduce<string[]>((a, c) => {
    if (c.role === "main") {
      return [...a, `track:${track} artist:${c.name}`]
    }
    return [...a, `artist:${c.name}`]
  }, [])
}