import { TRACK_ARTIST_ROLE } from "@db/enums";
import { TrackArtistRole } from "@db/types";

export const VALID_LEAD_ROLES: TrackArtistRole[] = [TRACK_ARTIST_ROLE.main, TRACK_ARTIST_ROLE.multiple] as const;

export const LEAD_ROLES_ERROR_MESSAGE = `첫 번째 아티스트의 role은 "${VALID_LEAD_ROLES.join(" 또는 ")}"이어야 합니다.`;