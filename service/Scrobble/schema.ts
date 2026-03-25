import { z } from "zod";

export const ScrobbleSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  artist: z.string().min(1),
  album: z.string().min(1),
  durationSec: z.number(),
  playedAt: z.string().datetime(),
});
