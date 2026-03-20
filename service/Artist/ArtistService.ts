import { Artist } from "@db/types";
import ArtistRepository from "@repository/Artist/ArtistRepository";
import { ArtistResolveRequest } from "@service/Artist/types";
import { buildArtistLookupKeys, getArtistSortName, getLatestExternalId } from "@service/Artist/utils";
import { Tx } from "@/types/db";

class ArtistService {
  #repository: ArtistRepository;

  constructor(tx: Tx) {
    this.#repository = new ArtistRepository(tx);
  }

  async resolveMany_old(request: ArtistResolveRequest[]) {
    const resolved: Artist[] = [];

    for (const r of request) {
      const artist = r.externalId
        ? await this.#repository.findByExternalId(r.externalId)
        : await this.#repository.findByName(r.name);

      if (artist) {
        resolved.push(artist);
      } else {
        const inserted = await this.#repository.insertMany([{
          name: r.name,
          sortName: getArtistSortName(r.name),
          externalId: r.externalId,
        }]);

        resolved.push({
          ...inserted[0],
          externalId: r.externalId,
        });
      }
    }
    return resolved;
  }

  async resolveMany(request: ArtistResolveRequest[]) {
    const { externalIds, names } = buildArtistLookupKeys(request);
    /* 1. 기존 아티스트 한 번에 조회 */
    const existing = await this.#repository.findManyByExternalIdOrName(externalIds, names);

    const toUpdateExternalId = existing.filter((a) => !a.externalId && !!getLatestExternalId(request, a));
    const result = new Map(
      existing.map((a) => [
        a.name,
        { ...a, externalId: getLatestExternalId(request, a) },
      ]),
    );

    /* `externalId`가 null이었던 항목 업데이트 */
    await Promise.all(
      toUpdateExternalId.map((a) =>
        this.#repository.updateExternalId(a.id, getLatestExternalId(request, a)),
      ),
    );

    const toInsert = request.filter((r) => !result.has(r.name));

    /* 2. 신규 항목 bulk insert */
    if (toInsert.length > 0) {
      const inserted = await this.#repository.insertMany(
        toInsert.map((r) => ({
          name: r.name,
          sortName: getArtistSortName(r.name),
          externalId: r.externalId ?? null,
        })),
      );

      inserted.forEach((a) => result.set(a.name, a));
    }
    return request.map((r) => result.get(r.name)!);
  }
}

export default ArtistService;
