---
trigger: always_on
---

# 프로젝트 클린 아키텍처 제안서 (Next.js App Router 기반)

## 1. 개요
현재 `d:\Workspace\ecommerce` 프로젝트는 Next.js(App Router)를 사용하고 있습니다. 
프론트엔드/풀스택 환경에서 클린 아키텍처를 적용하는 주된 목적은 **비즈니스 로직을 프레임워크(Next.js)나 외부 인프라(DB, 외부 API)로부터 격리**시켜서, 유지보수성과 테스트 용이성을 극대화하는 것입니다.

## 2. 추천 폴더 구조

프로젝트 루트 하위에 `src/` 폴더를 두고, 계층별로 관심사를 분리하는 구조를 추천합니다.

```text
d:\Workspace\ecommerce
├── app/                    # 1. Framework Layer (Next.js 영역)
│   ├── layout.tsx          # 전역 레이아웃
│   ├── page.tsx            # 라우팅 및 페이지 진입점
│   ├── api/                # API Routes (외부 시스템 접근용 엔드포인트)
│   └── ...                 
│
├── src/                    # 2. 핵심 비즈니스 및 인프라 영역 (Framework Agnostic)
│   ├── core/               # 2-1. Domain & Application Layer (순수 비즈니스 로직)
│   │   ├── domain/         # 도메인 모델 (Entities, Types, Value Objects)
│   │   │   └── User.ts     # 예: 사용자 타입 및 핵심 검증 로직
│   │   └── use-cases/      # 유스케이스 (애플리케이션 서비스, 비즈니스 흐름)
│   │       └── RegisterUser.ts # 예: 회원가입 로직 (도메인과 리포지토리 조합)
│   │
│   ├── infrastructure/     # 2-2. Infrastructure Layer (외부 연동 구현체)
│   │   ├── database/       # DB 연동 설정 및 ORM 모델 (Prisma, Drizzle 등)
│   │   ├── repositories/   # 도메인 인터페이스를 구현한 Repository 클래스/함수
│   │   ├── external/       # 외부 API 연동 (토스페이먼츠, 이메일 발송 등)
│   │   └── config/         # 환경 변수 및 전역 설정 (.env 등 매핑)
│   │
│   └── presentation/       # 2-3. Presentation Layer (UI 및 클라이언트 상태)
│       ├── components/     # 재사용 가능한 순수 UI 컴포넌트
│       ├── hooks/          # 커스텀 훅 (상태 관리, React Query 페칭 등)
│       ├── stores/         # 클라이언트 전역 상태 관리 (Zustand 등)
│       └── actions/        # Server Actions (서버 컴포넌트에서 use-case 호출)
│
├── public/                 # 정적 리소스 (이미지, 폰트 등)
├── next.config.ts
├── package.json
└── ...
```

## 3. 계층별 상세 역할 및 작성 규칙

### 3.1. `app/` (Framework Layer)
*   **역할:** Next.js가 제공하는 라우팅, 서버 컴포넌트 설정, 메타데이터 등을 담당합니다.
*   **규칙:** 
    *   이곳에 데이터베이스 조회나 복잡한 비즈니스 로직을 직접 작성하지 않습니다.
    *   `page.tsx`는 `src/presentation`의 UI 컴포넌트를 불러오고, 데이터를 가져올 때는 `src/core/use-cases`나 `src/presentation/actions`를 호출하여 화면에 전달하는 껍데기(Entry Point) 역할만 수행합니다.

### 3.2. `src/core/` (Domain & Application Layer)
*   **역할:** 애플리케이션이 무엇을 하는지(What)를 정의하는 가장 핵심적인 계층입니다.
*   **규칙:**
    *   Next.js 모듈(`next/router`, `next/headers` 등)이나 UI 라이브러리(`react`)를 절대 import 하지 않습니다.
    *   **Domain:** 비즈니스 엔티티(예: `Product`, `Order`)의 타입과 핵심 제약조건을 정의합니다. 데이터베이스 접근을 위한 추상화된 인터페이스(Interface)도 이곳에 정의합니다.
    *   **Use-cases:** 실제 서비스 로직이 흐르는 곳입니다. 예를 들어 `ProcessPaymentUseCase`는 주문 확인 -> 외부 결제 요청 -> DB 저장 등의 흐름을 도메인과 인터페이스만을 이용해 서술합니다.

### 3.3. `src/infrastructure/` (Infrastructure Layer)
*   **역할:** 외부 세상과 소통하는 방법을 구현(How)하는 계층입니다.
*   **규칙:**
    *   `src/core`에 정의된 인터페이스(Repository)를 implements(구현)하여 실제 DB(Supabase, PostgreSQL 등)나 외부 API에 질의합니다.
    *   프레임워크나 외부 기술스택이 변경되더라도 이 계층만 교체하면 핵심 비즈니스는 영향을 받지 않습니다.

### 3.4. `src/presentation/` (Presentation Layer)
*   **역할:** 사용자에게 화면을 보여주고 입력을 받는 UI를 담당합니다.
*   **규칙:**
    *   React 컴포넌트들은 이곳에 모입니다.
    *   UI 컴포넌트는 오직 '보여주는 것'에 집중하고, 복잡한 로직은 Custom Hook으로 분리하거나, 폼 제출 등의 로직은 Server Actions로 넘겨 처리합니다.

## 4. 진행 시 주의사항 (글로벌 규칙 준수)
1. **단계적 도입:** 기존 코드 베이스가 있다면 한 번에 모든 것을 옮기려 하지 마시고, 새로운 기능(Feature)이나 특정 도메인(예: 유저 관리)부터 점진적으로 분리하는 것을 추천합니다.
2. **사전 동의:** 기존에 잘 돌아가던 파일을 이동하거나 수정할 때는 사전에 "A파일을 B폴더로 이동하려고 하는데 진행할까요?"라고 꼭 물어보고 진행하겠습니다.
3. **코드 문서화:** 코딩 초보자나 교육 목적으로 이해하기 쉽도록, 앞으로 코드를 작성할 때 각 로직의 역할과 흐름을 주석으로 상세히 남기겠습니다.
4. **보안 유의:** `infrastructure` 단에서 개인정보나 결제 정보 등 민감 데이터를 다룰 때는 쿼리 작성 시 암호화 및 보안 수칙을 최우선으로 적용하겠습니다.
