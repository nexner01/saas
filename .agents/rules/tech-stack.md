---
trigger: always_on
---

# Technology Stack Rules (Next.js + Supabase)

이 프로젝트는 **Next.js (App Router)**와 **Supabase**를 핵심 기술 스택으로 사용합니다. 일관된 개발 환경과 안정적인 서비스를 위해 아래의 기술 스택 관련 룰을 준수해야 합니다.

## 1. 프론트엔드 / 프레임워크: Next.js (App Router)
*   **서버 컴포넌트 우선:** 기본적으로 모든 컴포넌트는 Server Component로 작성하며, 상호작용(상태 관리, 이벤트 리스너 등)이 필요한 경우에만 `"use client"`를 명시합니다.
*   **Next.js 내장 최적화:** 이미지(`next/image`), 라우팅(`next/link`), 폰트(`next/font`) 등 프레임워크가 제공하는 최적화 기능을 최우선으로 활용합니다.
*   *더 자세한 프레임워크 코딩 규칙은 `Next.js-framework.md`를 참고하세요.*

## 2. 백엔드 / 데이터베이스: Supabase
Supabase는 이 프로젝트의 데이터베이스(PostgreSQL), 인증(Authentication), 스토리지(Storage)를 담당합니다.

### 2.1 클라이언트/서버 인스턴스 분리 (@supabase/ssr 활용)
*   Next.js App Router 환경에서는 서버와 클라이언트 환경이 철저히 분리되어 있습니다.
*   Supabase 클라이언트를 생성할 때 컴포넌트의 환경(Server Component, Server Action, Route Handler, Client Component)에 맞는 올바른 클라이언트 팩토리 함수를 사용해야 합니다.

### 2.2 타입 안전성 (Type Safety)
*   Supabase 데이터베이스 스키마 기반으로 자동 생성된 TypeScript 타입(`Database` 타입)을 사용하여, 데이터베이스 질의 시 완벽한 타입 추론과 검증이 이루어지도록 합니다.
*   `any` 타입의 사용은 금지됩니다.

### 2.3 SQL 쿼리 및 마이그레이션 관리 (★ 필수 규칙)
*   **파일명 규칙:** 모든 SQL 쿼리 및 마이그레이션 파일은 생성 시 파일명 앞에 `000_` 형태의 순서 번호를 반드시 붙여야 합니다. (예: `001_create_users_table.sql`, `002_add_profile_image.sql`)
*   **저장 위치:** 생성된 모든 SQL 파일은 프로젝트 내에 흩어지지 않도록 반드시 `supabase/migrations/` 폴더 내에 모아서 관리합니다.

### 2.4 보안 및 권한 제어 (RLS 및 암호화)
*   **Row Level Security (RLS):** Supabase의 모든 테이블에는 기본적으로 RLS를 활성화하고, 사용자(User)가 본인의 데이터만 조회/수정/삭제할 수 있도록 명확한 정책(Policy)을 작성합니다.
*   **민감 데이터 암호화:** 사용자의 개인정보(비밀번호, 전화번호, 학생 정보 등)나 결제와 관련된 민감한 데이터를 데이터베이스에 저장할 때는 애플리케이션(Infrastructure 계층) 레벨에서 반드시 암호화/복호화 로직을 거쳐야 합니다.

### 2.5 마이그레이션 (Migrations)
*   **Row Level Security (RLS):** Supabase의 모든 테이블에는 기본적으로 RLS를 활성화하고, 사용자(User)가 본인의 데이터만 조회/수정/삭제할 수 있도록 명확한 정책(Policy)을 

## 3. 아키텍처와의 결합 (Clean Architecture 적용)
*   supabase/migrations 폴더에 위치
*   마이그레이션을 수정하거나 삭제하거나 새로 생성할 때는 항상 사용자의 허가 받기.
