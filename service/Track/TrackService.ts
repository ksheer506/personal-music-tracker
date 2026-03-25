import { Tx } from "@/types/db";
import { Track } from "@db/types";
import TrackRepository from "@repository/Track/TrackRepository";
import { TrackCreateRequest } from "@service/Track/types";

class TrackService {
  #repository: TrackRepository;

  constructor(tx: Tx) {
    this.#repository = new TrackRepository(tx);
  }

  async findOrCreate(request: TrackCreateRequest): Promise<Track> {
    const { artists, ...t } = request;
    const existing = await this.#repository.findByTitleAndArtistIds(
      t.title,
      artists.map((a) => a.id),
    );
    if (existing) {
      return existing;
    }
    const inserted = await this.#repository.insert(t);

    await this.#repository.insertArtists(
      artists.map((artist) => ({
        trackId: inserted.id,
        artistId: artist.id,
        role: artist.role,
      })),
    );
    return inserted;
  }
}

export default TrackService;