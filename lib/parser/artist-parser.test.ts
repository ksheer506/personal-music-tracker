import { describe, expect, it } from "vitest";

import { parseArtists } from "./artist-parser";

describe("parseArtists", () => {
  it("artist에 단일 아티스트만 있으면 main으로 반환한다", () => {
    expect(parseArtists("Song", "IU")).toEqual([{ name: "IU", role: "main" }]);
  });

  it("artist에 여러 아티스트가 있으면 모두 multiple로 반환한다", () => {
    expect(parseArtists("Song", "A, B, C")).toEqual([
      { name: "A", role: "multiple" },
      { name: "B", role: "multiple" },
      { name: "C", role: "multiple" },
    ]);
  });

  it("track의 feat 아티스트를 feature로 추가한다", () => {
    expect(parseArtists("Song(feat. D, E)", "A, B")).toEqual([
      { name: "A", role: "multiple" },
      { name: "B", role: "multiple" },
      { name: "D", role: "feature" },
      { name: "E", role: "feature" },
    ]);
  });

  it("track의 with 아티스트를 with로 추가한다", () => {
    expect(parseArtists("Song(with. F)", "A")).toEqual([
      { name: "A", role: "main" },
      { name: "F", role: "with" },
    ]);
  });

  it("feat, with 모두 있으면 각각의 role로 모두 추가한다", () => {
    expect(parseArtists("Song(feat. B)(with. C, D)", "A")).toEqual([
      { name: "A", role: "main" },
      { name: "B", role: "feature" },
      { name: "C", role: "with" },
      { name: "D", role: "with" },
    ]);
  });
});
