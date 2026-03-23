export const PERIOD_OPTIONS = [
  { label: "7일", value: "7d" },
  { label: "30일", value: "30d" },
  { label: "90일", value: "90d" },
  { label: "180일", value: "180d" },
  { label: "1년", value: "1y" },
] as const;

export type PeriodOption = typeof PERIOD_OPTIONS[number]["value"];

export const MOTION_TOKENS = {
  hoverMs: 190,
  filterMs: 200,
  slideMs: 330,
  drawerOverlayOpacity: 0.35,
  easeStandard: "cubic-bezier(0.2, 0, 0, 1)",
  kpiCountDurationMs: 1000,
};
