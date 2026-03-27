# Personal Music Tracker – AGENTS.md

개인 음악 감상 기록(Scrobble)을 관리·분석하는 Next.js 15 (App Router) + React 19 + TypeScript 풀스택 앱. 전체 의존성은 [package.json](package.json)을 참조.

## Architecture

요청 흐름: **Page / Route Handler → Service → Repository → DB**

- Service와 Repository는 **class + default export** 패턴을 사용한다.
- **Repository**와 **하위 Service** 생성자는 `Tx` (Drizzle 트랜잭션 또는 db 인스턴스)를 주입받는다. [types/db.ts](types/db.ts)를 참조.
- **최상위 Service** (ScrobbleService 등)는 `Tx`를 받지 않고 내부에서 `db.transaction()` 으로 트랜잭션을 열어 하위 Service/Repository에 전달한다. [service/Scrobble/ScrobbleService.ts](service/Scrobble/ScrobbleService.ts)를 참조.
- DB 클라이언트 인스턴스는 [db/index.ts](db/index.ts)를 참조.

## DB Schema

테이블 정의: [db/schema.ts](db/schema.ts), enum: [db/enums.ts](db/enums.ts), relation: [db/relations.ts](db/relations.ts)를 참조.
Drizzle 설정: [drizzle.config.ts](drizzle.config.ts), 마이그레이션 SQL: [drizzle/](drizzle/)를 참조.

## Coding Conventions

- **Private 필드**: ES private field (`#field`) 사용.
- **주석 언어**: 한국어 (도메인 설명, 비즈니스 로직 의도)
- **export**: 클래스 및 컴포넌트는 `class/function` + `export default`, 그 외 일반 변수 및 함수는 `export const` 방식을 사용.
- import 시 [tsconfig.json](tsconfig.json)에 정의된 path alias를 사용.
- 포맷팅 규칙(들여쓰기, 따옴표, JSX 등)은 [eslint.config.mjs](eslint.config.mjs)를 따른다.

## Testing

- Vitest(설정: [vitest.config.ts](vitest.config.ts)), Node v20 환경. `**/*.test.ts`
- Repository를 `vi.mock`으로 모킹하여 Service 단위 테스트. [service/Album/AlbumService.test.ts](service/Album/AlbumService.test.ts)를 참조.

## Auth

Supabase SSR 기반 인증. 미들웨어에서 세션을 갱신하고 미인증 사용자를 `/auth/login`으로 리다이렉트. [middleware.ts](middleware.ts) → [lib/supabase/middleware.ts](lib/supabase/middleware.ts) 참조.
