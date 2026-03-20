import { z } from "zod";

export const ScrobbleSchema = z.object({
  userId: z.string().uuid(),
  track: z.string().min(1),
  artist: z.string().min(1),
  album: z.string().optional(),
  playedAt: z.string().datetime(),
});
