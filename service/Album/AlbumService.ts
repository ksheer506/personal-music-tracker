import { Tx } from "@/types/db";
import AlbumRepository from "@repository/Album/AlbumRepository";
import { AlbumCreateRequest } from "@service/Album/types";
import { getAlbumArtistRole } from "@service/Album/utils";

class AlbumService {
  #repository: AlbumRepository;

  constructor(tx: Tx) {
    this.#repository = new AlbumRepository(tx);
  }

  async findOrCreate(request: AlbumCreateRequest) {
    const { artists, ...album } = request;
    const existing = await this.#repository.findByTitleAndArtistIds(album.title, artists.map((a) => a.id));

    if (existing) {
      return existing;
    }
    const inserted = await this.#repository.insert(album);
    await this.#repository.insertArtists(
      artists.map((artist) => ({
        albumId: inserted.id,
        artistId: artist.id,
        role: getAlbumArtistRole(artist.role),
      })),
    );
    return inserted;
  }
}

export default AlbumService;