import { describe, expect, it, vi, beforeEach } from "vitest";
import AlbumService from "./AlbumService";
import { AlbumCreateRequest } from "./types";
import { ArtistWithRole } from "@db/types";
import { Tx } from "@/types/db";
import { LEAD_ROLES_ERROR_MESSAGE } from "@service/Album/const";
import { TRACK_ARTIST_ROLE } from "@db/enums";

const mockRepository = {
  findByExternalId: vi.fn(),
  findManyByTitleAndArtistIds: vi.fn(),
  insert: vi.fn(),
  insertArtists: vi.fn(),
  updateArtistRoles: vi.fn(),
};

vi.mock("@repository/Album/AlbumRepository", () => ({
  default: function () { return mockRepository; },
}));

describe("AlbumService.findOrCreate", () => {
  let service: AlbumService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AlbumService({} as Tx);
  });

  describe("신규 앨범 생성", () => {
    it("DB에 앨범이 없으면 새 앨범을 생성하고 아티스트를 연결한다", async () => {
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([]);
      mockRepository.insert.mockResolvedValue({ id: "new-album-id", title: "AlbumA" });

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: "main" },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toEqual({ id: "new-album-id", title: "AlbumA" });
      expect(mockRepository.insert).toHaveBeenCalledOnce();
      expect(mockRepository.insertArtists).toHaveBeenCalledWith([
        expect.objectContaining({ albumId: "new-album-id", artistId: "artist-1", role: "main" }),
      ]);
    });

    it("DB에 앨범이 없고 여러 아티스트가 있으면 새 앨범에 모두 연결한다", async () => {
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([]);
      mockRepository.insert.mockResolvedValue({ id: "new-album-id", title: "AlbumA" });

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: "main" },
        { id: "artist-2", name: "Artist2", role: "feature" },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toEqual({ id: "new-album-id", title: "AlbumA" });
      expect(mockRepository.insert).toHaveBeenCalledOnce();
      expect(mockRepository.insertArtists).toHaveBeenCalledWith([
        expect.objectContaining({ albumId: "new-album-id", artistId: "artist-1", role: "main" }),
        expect.objectContaining({ albumId: "new-album-id", artistId: "artist-2", role: "contributor" }),
      ]);
    });

    it("모든 아티스트가 multiple이면 various role로 연결한다", async () => {
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([]);
      mockRepository.insert.mockResolvedValue({ id: "new-album-id", title: "AlbumA" });

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: TRACK_ARTIST_ROLE.multiple },
        { id: "artist-2", name: "Artist2", role: TRACK_ARTIST_ROLE.multiple },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toEqual({ id: "new-album-id", title: "AlbumA" });
      expect(mockRepository.insert).toHaveBeenCalledOnce();
      expect(mockRepository.insertArtists).toHaveBeenCalledWith([
        expect.objectContaining({ albumId: "new-album-id", artistId: "artist-1", role: "various" }),
        expect.objectContaining({ albumId: "new-album-id", artistId: "artist-2", role: "various" }),
      ]);
    });
  });

  describe("기존 앨범 반환", () => {
    it("DB에 동일한 앨범-아티스트 조합이 있으면 기존 앨범을 반환한다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "main" },
      ]);
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([existing]);

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: "main" },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.insert).not.toHaveBeenCalled();
      expect(mockRepository.insertArtists).not.toHaveBeenCalled();
      expect(mockRepository.updateArtistRoles).not.toHaveBeenCalled();
    });

    it("기존 앨범에 존재하는 아티스트와 일치하면 추가하지 않는다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "various" },
        { artistId: "artist-2", role: "various" },
      ]);
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([existing]);

      const request = createRequest("AlbumA", [
        { id: "artist-2", name: "Artist2", role: "main" },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.insert).not.toHaveBeenCalled();
      expect(mockRepository.insertArtists).not.toHaveBeenCalled();
    });
  });

  describe("기존 앨범에 아티스트 추가", () => {
    it("기존 앨범에 새 아티스트(feat)를 추가한다 - 앨범을 새로 생성하지 않는다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "main" },
      ]);
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([existing]);

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: "main" },
        { id: "artist-2", name: "Artist2", role: "feature" },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.insert).not.toHaveBeenCalled();
      expect(mockRepository.insertArtists).toHaveBeenCalledWith([
        expect.objectContaining({
          albumId: "existing-id",
          artistId: "artist-2",
          role: "contributor",
        }),
      ]);
    });

    it("기존 앨범에 여러 새 아티스트를 추가한다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "main" },
      ]);
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([existing]);

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: "main" },
        { id: "artist-2", name: "Artist2", role: "feature" },
        { id: "artist-3", name: "Artist3", role: "with" },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.insert).not.toHaveBeenCalled();
      expect(mockRepository.insertArtists).toHaveBeenCalledWith([
        expect.objectContaining({ albumId: "existing-id", artistId: "artist-2", role: "contributor" }),
        expect.objectContaining({ albumId: "existing-id", artistId: "artist-3", role: "contributor" }),
      ]);
    });

    it("기존 앨범에 새 아티스트를 various로 추가한다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "various" },
        { artistId: "artist-2", role: "various" },
      ]);
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([existing]);

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: TRACK_ARTIST_ROLE.multiple },
        { id: "artist-3", name: "Artist3", role: TRACK_ARTIST_ROLE.multiple },
        { id: "artist-4", name: "Artist4", role: TRACK_ARTIST_ROLE.multiple },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.insert).not.toHaveBeenCalled();
      expect(mockRepository.insertArtists).toHaveBeenCalledWith([
        expect.objectContaining({ albumId: "existing-id", artistId: "artist-3", role: "various" }),
        expect.objectContaining({ albumId: "existing-id", artistId: "artist-4", role: "various" }),
      ]);
    });
  });

  describe("기존 앨범에 대한 role 강등 처리 (→ various)", () => {
    it("1. main 아티스트가 있는 앨범에 various 아티스트가 들어오면 기존 main을 various로 강등한다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "main" },
      ]);
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([existing]);

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: TRACK_ARTIST_ROLE.multiple },
        { id: "artist-2", name: "Artist2", role: TRACK_ARTIST_ROLE.multiple },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.updateArtistRoles).toHaveBeenCalledWith(
        "existing-id", ["artist-1"], "various",
      );
      expect(mockRepository.insertArtists).toHaveBeenCalledWith([
        expect.objectContaining({ albumId: "existing-id", artistId: "artist-2", role: "various" }),
      ]);
    });

    it("2. main + contributor가 있는 앨범에 various 아티스트가 들어오면 모두 various로 강등한다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "main" },
        { artistId: "artist-2", role: "contributor" },
      ]);
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([existing]);

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: TRACK_ARTIST_ROLE.multiple },
        { id: "artist-3", name: "Artist3", role: TRACK_ARTIST_ROLE.multiple },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.updateArtistRoles).toHaveBeenCalledWith(
        "existing-id", ["artist-1", "artist-2"], "various",
      );
      expect(mockRepository.insertArtists).toHaveBeenCalledWith([
        expect.objectContaining({ albumId: "existing-id", artistId: "artist-3", role: "various" }),
      ]);
    });

    it("3. various 앨범에 main(단독) 아티스트가 들어와도 main으로 승격하지 않는다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "various" },
        { artistId: "artist-2", role: "various" },
      ]);
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([existing]);

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: "main" },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.updateArtistRoles).not.toHaveBeenCalled();
      expect(mockRepository.insertArtists).not.toHaveBeenCalled();
    });

    it("4. contributor가 있는 앨범에 main(단독)이 들어오면 모두 various로 강등한다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "main" },
        { artistId: "artist-2", role: "contributor" },
      ]);
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([existing]);

      const request = createRequest("AlbumA", [
        { id: "artist-2", name: "Artist2", role: "main" },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.updateArtistRoles).toHaveBeenCalledWith(
        "existing-id", ["artist-1", "artist-2"], "various",
      );
      expect(mockRepository.insertArtists).not.toHaveBeenCalled();
    });

    it("5. contributor가 있는 앨범에 various 아티스트가 들어오면 모두 various로 강등한다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "main" },
        { artistId: "artist-2", role: "contributor" },
      ]);
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([existing]);

      const request = createRequest("AlbumA", [
        { id: "artist-2", name: "Artist2", role: TRACK_ARTIST_ROLE.multiple },
        { id: "artist-3", name: "Artist3", role: TRACK_ARTIST_ROLE.multiple },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.updateArtistRoles).toHaveBeenCalledWith(
        "existing-id", ["artist-1", "artist-2"], "various",
      );
      expect(mockRepository.insertArtists).toHaveBeenCalledWith([
        expect.objectContaining({ albumId: "existing-id", artistId: "artist-3", role: "various" }),
      ]);
    });
  });

  describe("externalId 기반 조회", () => {
    it("externalId가 있으면 externalId로 앨범을 조회한다", async () => {
      const existing = createExistingAlbum("existing-id", "AlbumA", [
        { artistId: "artist-1", role: "main" },
      ]);
      mockRepository.findByExternalId.mockResolvedValue(existing);

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: "main" },
      ], "ext-album-1");
      const result = await service.findOrCreate(request);

      expect(result).toBe(existing);
      expect(mockRepository.findByExternalId).toHaveBeenCalledWith("ext-album-1");
      expect(mockRepository.findManyByTitleAndArtistIds).not.toHaveBeenCalled();
    });

    it("externalId로 조회했지만 없으면 새 앨범을 생성한다", async () => {
      mockRepository.findByExternalId.mockResolvedValue(undefined);
      mockRepository.insert.mockResolvedValue({ id: "new-album-id", title: "AlbumA" });

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: "main" },
      ], "ext-album-1");
      const result = await service.findOrCreate(request);

      expect(result).toEqual({ id: "new-album-id", title: "AlbumA" });
      expect(mockRepository.findByExternalId).toHaveBeenCalledWith("ext-album-1");
      expect(mockRepository.insert).toHaveBeenCalledOnce();
    });

    it("externalId가 없으면 title + artistId로 조회한다", async () => {
      mockRepository.findManyByTitleAndArtistIds.mockResolvedValue([]);
      mockRepository.insert.mockResolvedValue({ id: "new-album-id", title: "AlbumA" });

      const request = createRequest("AlbumA", [
        { id: "artist-1", name: "Artist1", role: "main" },
      ]);
      const result = await service.findOrCreate(request);

      expect(result).toEqual({ id: "new-album-id", title: "AlbumA" });
      expect(mockRepository.findByExternalId).not.toHaveBeenCalled();
      expect(mockRepository.findManyByTitleAndArtistIds).toHaveBeenCalledWith("AlbumA", ["artist-1"]);
    });
  });

  describe("첫번째 아티스트의 role이 유효하지 않으면 에러를 던진다", () => {
    it.each(["feature", "with"] as const)(
      "첫 번째 아티스트의 role이 %s이면 에러를 던진다",
      async (role) => {
        const request = createRequest("AlbumA", [
          { id: "artist-1", name: "Artist1", role },
        ]);

        await expect(service.findOrCreate(request)).rejects.toThrow(LEAD_ROLES_ERROR_MESSAGE);
      },
    );
  });
});

function createRequest(
  title: string,
  artists: Pick<ArtistWithRole, "id" | "name" | "role">[],
  externalId?: string,
): AlbumCreateRequest {
  return {
    title,
    externalId: externalId ?? null,
    artists: artists.map((a) => ({
      id: a.id,
      externalId: null,
      name: a.name,
      sortName: a.name.toLowerCase(),
      createdAt: new Date(),
      role: a.role,
    })),
  };
}

function createExistingAlbum(
  id: string,
  title: string,
  albumArtists: { artistId: string; role: string }[],
) {
  return {
    id,
    title,
    externalId: null,
    releaseAt: null,
    createdAt: new Date(),
    albumArtists: albumArtists.map((a) => ({
      albumId: id,
      artistId: a.artistId,
      role: a.role,
      createdAt: new Date(),
    })),
  };
}
