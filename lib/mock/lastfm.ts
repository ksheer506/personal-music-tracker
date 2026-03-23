import type { PeriodOption } from "@/lib/design/tokens";

export type MetricCard = {
  id: string;
  label: string;
  value: number;
  unit?: string;
  delta: number;
};

export type RankItem = {
  id: string;
  label: string;
  value: number;
};

export type DashboardData = {
  metrics: MetricCard[];
  artists: RankItem[];
  tracks: RankItem[];
  weekdayPattern: RankItem[];
  hourlyHeatmap: number[];
};

const periodMultiplier: Record<PeriodOption, number> = {
  "7d": 0.3,
  "30d": 1,
  "90d": 2.4,
  "180d": 4.8,
  "1y": 7.6,
};

const baseMetrics: MetricCard[] = [
  { id: "scrobbles", label: "총 스크로블", value: 3214, delta: 12.4 },
  { id: "artists", label: "아티스트 수", value: 267, delta: 4.8 },
  { id: "newTracks", label: "신규곡 비율", value: 34, unit: "%", delta: -2.1 },
  { id: "avgTime", label: "평균 청취시간", value: 78, unit: "분", delta: 6.3 },
];

const artists: RankItem[] = [
  { id: "a1", label: "The 1975", value: 173 },
  { id: "a2", label: "Radiohead", value: 148 },
  { id: "a3", label: "Nujabes", value: 132 },
  { id: "a4", label: "혁오", value: 124 },
  { id: "a5", label: "Daft Punk", value: 116 },
];

const tracks: RankItem[] = [
  { id: "t1", label: "Jigsaw Falling Into Place", value: 66 },
  { id: "t2", label: "Robbers", value: 59 },
  { id: "t3", label: "Feather", value: 57 },
  { id: "t4", label: "TOMBOY", value: 52 },
  { id: "t5", label: "Something About Us", value: 48 },
];

const weekdayPattern: RankItem[] = [
  { id: "mon", label: "월", value: 72 },
  { id: "tue", label: "화", value: 84 },
  { id: "wed", label: "수", value: 89 },
  { id: "thu", label: "목", value: 93 },
  { id: "fri", label: "금", value: 108 },
  { id: "sat", label: "토", value: 116 },
  { id: "sun", label: "일", value: 102 },
];

const hourlyHeatmap = [
  0.22, 0.18, 0.12, 0.08, 0.05, 0.06, 0.11,
  0.2, 0.28, 0.34, 0.4, 0.46, 0.52, 0.57,
  0.64, 0.72, 0.81, 0.9, 0.85, 0.78, 0.69,
  0.58, 0.44, 0.3, 0.23, 0.17, 0.11, 0.09,
];

export function getDashboardData(period: PeriodOption): DashboardData {
  const multiplier = periodMultiplier[period];
  const scaledMetrics = baseMetrics.map((metric) => ({
    ...metric,
    value: metric.unit === "%" || metric.unit === "분"
      ? metric.value
      : Math.round(metric.value * multiplier),
  }));

  const scaleRank = (items: RankItem[]) => (
    items.map((item) => ({
      ...item,
      value: Math.max(1, Math.round(item.value * Math.pow(multiplier, 0.55))),
    }))
  );

  return {
    metrics: scaledMetrics,
    artists: scaleRank(artists),
    tracks: scaleRank(tracks),
    weekdayPattern: scaleRank(weekdayPattern),
    hourlyHeatmap,
  };
}

export type ComparePreset = "month" | "weekend" | "night";

export function getCompareData(preset: ComparePreset) {
  if (preset === "weekend") {
    return {
      leftLabel: "평일",
      rightLabel: "주말",
      leftValue: 1820,
      rightValue: 1438,
      changeRate: -21,
      highlights: [
        "주말에는 롱트랙(6분+) 재생 비율이 18% 증가했습니다.",
        "금-토 밤 구간에 전자음악 비중이 가장 높습니다.",
      ],
    };
  }

  if (preset === "night") {
    return {
      leftLabel: "오전 6시-오후 6시",
      rightLabel: "오후 6시-오전 6시",
      leftValue: 1533,
      rightValue: 1702,
      changeRate: 11,
      highlights: [
        "야간에는 신규 아티스트 탐색 비율이 24% 높습니다.",
        "야간 Top 장르는 인디/신스팝 순으로 나타났습니다.",
      ],
    };
  }

  return {
    leftLabel: "지난 달",
    rightLabel: "이번 달",
    leftValue: 2860,
    rightValue: 3214,
    changeRate: 12,
    highlights: [
      "총 스크로블이 12% 증가했습니다.",
      "상위 10개 트랙 집중도가 낮아져 취향 분산이 늘었습니다.",
    ],
  };
}
