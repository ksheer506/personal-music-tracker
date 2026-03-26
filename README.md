# Personal Music Tracker v1

개인 음악 감상 기록을 분석하고 시각화하는 대시보드 애플리케이션입니다.

## Tech Stack

| 영역       | 기술                     |
| ---------- | ------------------------ |
| Framework  | Next.js 15 (App Router)  |
| UI         | React 19, Tailwind CSS 4 |
| Charts     | Recharts                 |
| Components | Radix UI, Lucide Icons   |
| Database   | PostgreSQL + Drizzle ORM |
| Auth       | NextAuth v5 (beta)       |
| Validation | Zod                      |
| Testing    | Vitest                   |

## 페이지별 기능

### `/` — Dashboard (홈)

메인 대시보드 페이지로, 음악 감상 데이터를 한눈에 파악할 수 있습니다.

- **기간 필터 (PeriodFilter)**: 원하는 기간별로 데이터를 필터링
- **KPI 카드**: 주요 지표(재생 수, 아티스트 수 등)를 애니메이션과 함께 표시하며, 이전 기간 대비 변화율(%) 제공
- **Top Artists / Tracks 차트**: 가장 많이 들은 아티스트와 트랙을 바 차트로 시각화
- **요일별 패턴 차트**: 요일별 청취 패턴을 바 차트로 표시
- **시간대별 히트맵 (Heatmap)**: 하루 중 시간대별 청취 밀도를 컬러 그리드로 시각화
- **최근 재생 목록**: 최근 들은 트랙 목록을 상대적 시간 표시와 함께 나열

### `/stats` — 상세 통계

아티스트별 청취 데이터를 필터링하고 정렬하여 상세하게 분석할 수 있는 페이지입니다.

- **사이드바 필터**: 기간, 최소 재생 횟수(범위), 정렬 기준(재생 수 / 이름) 설정
- **바 차트 + 리스트 동기화**: 차트 항목에 마우스를 올리면 아래 리스트에서 해당 항목이 하이라이트되고, 리스트에서 마우스를 올려도 차트가 동기화
- **필터 변경 시 로딩 애니메이션**: 필터 적용 시 pulse 애니메이션으로 로딩 상태 표시

### `/compare` — 비교 분석

서로 다른 기간이나 조건의 청취 데이터를 비교하여 인사이트를 제공하는 페이지입니다.

- **비교 프리셋**: 이번 달 vs 지난 달, 평일 vs 주말, 낮 vs 밤 등 미리 정의된 비교 옵션 제공
- **요약 카드**: 두 기간의 재생 수와 변화율(%)을 나란히 표시
- **인사이트**: 비교 결과에서 도출된 핵심 포인트를 불릿 리스트로 제공
- **요약 노트**: 비교 분석에 대한 간결한 텍스트 요약

### `/timeline` — 타임라인 (예정)

향후 릴리스에서 구현 예정인 타임라인 페이지입니다.

- 기간별 드릴다운
- 연속 청취 스트릭
- 리캡 카드
- 현재는 플레이스홀더 상태

### `/settings` — 설정 (예정)

v1에서는 정적 안내 텍스트만 표시되는 설정 페이지입니다.

- 기본 기간 설정
- 차트 애니메이션 설정
- 변화율 표시 설정
- 테마 / 시스템 다크모드
- 현재는 플레이스홀더 상태

## 데이터 모델

| 테이블          | 설명                                                           |
| --------------- | -------------------------------------------------------------- |
| `users`         | 사용자 정보 (email, password, username)                        |
| `artists`       | 아티스트 정보 (name, sort_name, external_id)                   |
| `albums`        | 앨범 정보 (title, release_at)                                  |
| `album_artists` | 앨범-아티스트 M:N 관계 (역할: main, contributor, various)      |
| `tracks`        | 트랙 정보 (title, album_id, duration_sec)                      |
| `track_artists` | 트랙-아티스트 M:N 관계 (역할: main, multiple, feature, with)   |
| `scrobbles`     | 재생 기록 (user_id, track_id, played_at, duration_sec, source) |

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# DB 마이그레이션
npx drizzle-kit push

# 테스트 실행
npm test
```
