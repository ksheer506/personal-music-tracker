import { db } from "@db/index";
import { artists } from "@db/schema";
import { Artist } from "@db/types";
import { ArtistResolveRequest } from "@service/Artist/types";
import { getArtistSortName } from "@service/Artist/utils";
import { eq } from "drizzle-orm";

class ArtistService {
  resolveMany(request: ArtistResolveRequest[]) {
    return db.transaction(async (tx) => {
      const resolved = []

      for (const r of request) {
        const where = r.externalId ? eq(artists.externalId, r.externalId) : eq(artists.name, r.name);
        const artist = await tx.query.artists.findFirst({ where })

        if (artist) {
          resolved.push(artist)
        } else {
          const inserted = await tx.insert(artists).values({
            name: r.name,
            sortName: getArtistSortName(r.name),
            externalId: r.externalId,
          }).returning();

          resolved.push({
            ...inserted[0],
            externalId: r.externalId
          })
        }
      }
      return resolved
    })
  }

  resolveMany2(request: ArtistResolveRequest[]) {
    const { externalId, name } = request.reduce((a, c) => {
      /** 
      * 동일 아티스트에 대해 `externalId`가 null -> string으로 달라질 수 있기 때문에 
      * `externalId`는 `name` 필터도 같이 적용
      * */
      if (c.externalId) {
        return { ...a, externalId: [...(a.externalId ?? []), c.externalId], name: [...(a.name ?? []), c.name] }
      }
      return { ...a, name: [...(a.name ?? []), c.name] }
    }, {} as { externalId: string[], name: string[] })

    return db.transaction(async (tx) => {
      /* 1. 기존 아티스트 한 번에 조회 */
      const existing = await tx.query.artists.findMany({
        where: (artists, op) => op.or(
          externalId ? op.inArray(artists.externalId, externalId) : undefined,
          name ? op.inArray(artists.name, name) : undefined
        )
      });
      const toUpdate = existing.filter((a) => !a.externalId && !!getLatestExternalId(request, a));
      const result = new Map(existing.map((a) => [
        a.name,
        { ...a, externalId: getLatestExternalId(request, a) }
      ]));

      /* `externalId`가 null이었던 항목 업데이트 */
      await Promise.all(toUpdate.map((a) => tx
        .update(artists)
        .set({ externalId: getLatestExternalId(request, a) })
        .where(eq(artists.id, a.id))
      ))

      const toInsert = request.filter((r) => !result.has(r.name));

      /* 2. 신규 항목 bulk insert */
      if (toInsert.length > 0) {
        const inserted = await tx
          .insert(artists)
          .values(toInsert.map((r) => ({
            name: r.name,
            sortName: getArtistSortName(r.name),
            externalId: r.externalId ?? null
          })))
          .returning();

        inserted.forEach((a) => result.set(a.name, a));
      }
      return request.map((r) => result.get(r.name)!);
    });
  }
}

const getLatestExternalId = (
  req: ArtistResolveRequest[],
  artist: Artist,
) => req.find((r) => r.name === artist.name)?.externalId ?? null

export default ArtistService;