---
trigger: always_on
---

# Next.js Framework Rules

이 문서는 Next.js(App Router) 프로젝트에서 일관성 있고 유지보수하기 쉬운 코드를 작성하기 위한 안티그래비티 룰(가이드라인)입니다. 코드 작성 시 이 규칙들을 항상 최우선으로 고려해야 합니다.

## 1. Server Component 최우선 사용 (Default to Server Components)
- **기본값:** 모든 컴포넌트는 기본적으로 Server Component로 작성합니다. 
- **Client Component 분리:** `useState`, `useEffect`와 같은 React 훅이나 `onClick` 같은 이벤트 리스너(상호작용)가 반드시 필요한 경우에만 파일 최상단에 `"use client"`를 선언하여 Client Component로 만듭니다.
- **트리 최하단 배치:** Client Component는 렌더링 트리의 가능한 한 가장 아래쪽(최하단)에 배치하여, 클라이언트 번들 사이즈를 최소화하고 서버 렌더링의 이점을 극대화합니다.

## 2. 간결하고 읽기 쉬운 코드 작성 (Readable & Concise Code)
- **조기 반환 (Early Return):** 조건문 중첩을 피하고 코드를 평탄하게 유지하기 위해 에러나 예외 상황은 함수 앞부분에서 조기 반환(`return`)합니다.
- **명확한 네이밍:** 변수와 함수 이름은 줄임말을 피하고, 그 역할과 목적을 명확히 알 수 있도록 서술적으로 작성합니다. (예: `handleFetchUser` 보다는 `fetchUserProfile`)
- **주석 활용:** 코딩 초보자도 쉽게 이해할 수 있도록 복잡한 로직에는 왜(Why) 그렇게 작성했는지 친절하고 상세한 한글 주석을 남깁니다.

## 3. 파일 분할 및 모듈화 (Modularize Large Files)
- **단일 책임 원칙 (SRP):** 하나의 파일(컴포넌트)이 너무 많은 역할(UI 렌더링, 데이터 패칭, 상태 관리 등)을 하거나 코드 라인 수가 지나치게 길어지면 주저하지 말고 여러 파일로 나눕니다.
- **관심사 분리:** 
  - UI 렌더링 로직은 작고 재사용 가능한 하위 컴포넌트로 분리합니다.
  - 복잡한 상태 관리나 부수 효과(Side Effects)는 커스텀 훅(Custom Hook)으로 분리합니다.
  - 헬퍼 함수나 순수 비즈니스 로직은 `utils`나 클린 아키텍처의 `use-cases` 폴더로 분리합니다.

## 4. 데이터 페칭 및 뮤테이션 (Data Fetching & Mutations)
- **서버 측 데이터 페칭:** 데이터 페칭은 가능한 한 Server Component에서 비동기(`async/await`) 함수로 직접 호출하여 서버 측에서 처리합니다.
- **Server Actions 활용:** 폼 제출이나 데이터베이스 업데이트와 같은 데이터 뮤테이션(변경)은 API Route를 따로 만들기보다는 Next.js의 Server Actions(`"use server"`)를 우선적으로 활용하여 간결하게 작성합니다.

## 5. Next.js 내장 최적화 기능 적극 활용 (Built-in Optimizations)
- **이미지 최적화:** <img> 태그 대신 `next/image`를 사용하여 레이아웃 시프트(CLS)를 방지하고 이미지를 최적화합니다.
- **네비게이션:** 페이지 간 이동 시에는 일반 <a> 태그 대신 `next/link`를 사용하여 클라이언트 사이드 라우팅 및 프리패칭(Prefetching)의 이점을 얻습니다.
- **폰트 최적화:** `next/font`를 사용하여 외부 폰트를 최적화하고 호스팅합니다.

## 6. 엄격한 타입 정의 (Strict Typing)
- **TypeScript:** 모든 컴포넌트, 함수의 매개변수(Props) 및 반환값에 명시적으로 TypeScript 타입을 정의합니다.
- **Any 금지:** `any` 타입의 사용은 철저히 지양하며, 데이터의 구조가 불확실할 경우 `unknown`을 사용하고 타입 가드를 통해 검증합니다.
