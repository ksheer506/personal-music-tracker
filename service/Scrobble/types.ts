import z from "zod";
import { ScrobbleSchema } from "./schema";

export type ScrobbleRequest = z.infer<typeof ScrobbleSchema>;