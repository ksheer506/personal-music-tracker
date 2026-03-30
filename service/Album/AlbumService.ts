import { Tx } from "@/types/db";
import { ALBUM_ARTIST_ROLE } from "@db/enums";
import { AlbumArtistRole } from "@db/types";
import AlbumRepository from "@repository/Album/AlbumRepository";
import { LEAD_ROLES_ERROR_MESSAGE, VALID_LEAD_ROLES } from "@service/Album/const";
import { AlbumCreateRequest } from "@service/Album/types";
import { getAlbumArtistRole } from "@service/Album/utils";

type ExistingAlbum = NonNullable<Awaited<ReturnType<AlbumRepository["findByExternalId"]>>>;

class AlbumService {
  #repository: AlbumRepository;

  constructor(tx: Tx) {
    this.#repository = new AlbumRepository(tx);
  }

  async findOrCreate(request: AlbumCreateRequest) {
    const { artists, ...album } = request;
    const leadRole = artists[0].role;

    if (!VALID_LEAD_ROLES.includes(leadRole)) {
      throw new Error(`${LEAD_ROLES_ERROR_MESSAGE} 입력값: "${leadRole}"`);
    }
    const artistIds = artists.map((a) => a.id);
    const existing = album.externalId
      ? await this.#repository.findByExternalId(album.externalId)
      : (await this.#repository.findManyByTitleAndArtistIds(album.title, artistIds))[0];

    if (!existing) {
      const inserted = await this.#repository.insert(album);
      await this.#repository.insertArtists(artists.map((a) => ({
        albumId: inserted.id,
        artistId: a.id,
        role: getAlbumArtistRole(a.role),
      })));
      return inserted;
    }

    await this.#syncArtists(existing, artists, getAlbumArtistRole(leadRole));
    return existing;
  }

  /**
   * 기존 앨범의 albumArtists와 요청 데이터를 비교하여
   * 새 아티스트 추가 또는 기존 아티스트의 role을 "various"로 강등 처리한다.
   *
   * 강등 조건:
   * - incoming이 "various"인데 기존에 "various"가 아닌 아티스트가 있는 경우
   * - 기존에 "contributor"가 있는데 incoming이 "main"인 경우 (동일 앨범에 단독 곡이 추가된 것이므로 VA 앨범)
   *
   * 모든 incoming 아티스트의 role이 기존과 동일하면 변경 없이 조기 반환한다.
   */
  async #syncArtists(
    existing: ExistingAlbum,
    artists: AlbumCreateRequest["artists"],
    incomingRole: AlbumArtistRole,
  ) {
    const existingMap = new Map(existing.albumArtists.map((a) => [a.artistId, a.role]));
    const toInsert = artists.filter((a) => !existingMap.has(a.id));

    const hasRoleConflict = artists.some((a) => {
      const existingRole = existingMap.get(a.id);
      return existingRole !== undefined && existingRole !== getAlbumArtistRole(a.role);
    });

    if (toInsert.length === 0 && !hasRoleConflict) {
      return;
    }
    const demoteIds = existing.albumArtists
      .filter((a) => a.role !== ALBUM_ARTIST_ROLE.various)
      .map((a) => a.artistId);

    const hasContributor = existing.albumArtists.some((a) => a.role === ALBUM_ARTIST_ROLE.contributor);
    const needsDemotion = hasRoleConflict && demoteIds.length > 0 && (
      incomingRole === ALBUM_ARTIST_ROLE.various ||
      (incomingRole === ALBUM_ARTIST_ROLE.main && hasContributor)
    );

    if (needsDemotion) {
      await this.#repository.updateArtistRoles(existing.id, demoteIds, ALBUM_ARTIST_ROLE.various);
    }
    if (toInsert.length === 0) {
      return;
    }
    await this.#repository.insertArtists(toInsert.map((a) => ({
      albumId: existing.id,
      artistId: a.id,
      role: needsDemotion ? ALBUM_ARTIST_ROLE.various : getAlbumArtistRole(a.role),
    })));
  }
}

export default AlbumService;