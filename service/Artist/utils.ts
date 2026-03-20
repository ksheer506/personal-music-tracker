export const getArtistSortName = (artist: string) => artist
  .trim()
  .toLowerCase()
  .replace(/^(the|a|an)\s+/i, "") // 앞 관사 제거
  .normalize("NFKD")