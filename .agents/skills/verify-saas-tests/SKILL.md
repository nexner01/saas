---
name: verify-saas-tests
description: >-
  Validates, audits, and executes the comprehensive test suite and coverage reports for the Noteflow SaaS project.
  Use this skill whenever asked to verify tests, run test validation, inspect coverage metrics (>=80%),
  or troubleshoot test failures across billing, subscription permissions, notes CRUD, and route protection.
---

# SaaS Project Test Verification Skill

이 스킬은 **Noteflow SaaS** 프로젝트의 도메인 로직, 컴포넌트, 백엔드 API 라우트 및 결제 플로우에 대한 전체 테스트 스위트를 검증하고 품질 기준(TDD 80% 이상 커버리지, Next.js 빌드 무결성)을 충족하는지 감사(Audit)하기 위한 표준 절차를 제공합니다.

---

## 1. 빠른 검증 절차 (Verification Steps)

### Step 1: 전체 테스트 스위트 실행
모든 단위 테스트(Unit) 및 통합 테스트(Integration)가 결함 없이 통과하는지 확인합니다.
```bash
npm run test
```
* **기대 결과:** 20개 테스트 파일, 72개 이상의 테스트가 모두 `PASS` (`All Green`).
* **테스트 격리 확인:** [vitest.setup.ts](file:///d:/Workspace/saas/vitest.setup.ts)에서 각 테스트 실행 전 `SupabaseNoteRepository.resetSeed()`가 호출되어 인메모리 노트 시드가 초기화되는지 확인합니다.

### Step 2: 코드 커버리지(Coverage) 80% 이상 검증
TDD 규칙에 정의된 **80% 이상**의 커버리지를 만족하는지 리포트를 산출합니다.
```bash
npx vitest run --coverage
```
* **필수 기준치:**
  * Lines: **>= 80%**
  * Statements: **>= 80%**
  * Functions: **>= 80%**
* **핵심 모듈 목표 커버리지:**
  * `src/core/use-cases/`: >= 90%
  * `src/infrastructure/external/TossBillingApiClient.ts`: >= 90%
  * `src/core/use-cases/ExecuteDueBillingsUseCase.ts`: >= 90%

### Step 3: TypeScript 타입 검증 및 프로덕션 빌드 무결성
테스트 통과 후 컴파일 오류 및 App Router 엔드포인트 누락이 없는지 빌드를 검증합니다.
```bash
npm run build
```
* **검증 라우트 목록 (총 11개 이상):**
  * `○ /` (랜딩 페이지)
  * `○ /dashboard` (대시보드 메인)
  * `○ /notes` (노트 관리)
  * `ƒ /notes/[id]` (노트 에디터 상세)
  * `○ /payment` (결제 및 플랜 선택)
  * `ƒ /api/payments/billing/issue` (빌링키 발급 및 1회차 자동 결제)
  * `ƒ /api/payments/billing/charge` (정기 결제 승인)
  * `ƒ /payment/success` / `○ /payment/fail`

---

## 2. 도메인별 테스트 검증 체크리스트

| 검증 도메인 | 대상 테스트 파일 | 핵심 검증 항목 |
| :--- | :--- | :--- |
| **토스페이먼츠 빌링 및 정기 결제** | [TossBillingApiClient.test.ts](file:///d:/Workspace/saas/src/infrastructure/external/__tests__/TossBillingApiClient.test.ts)<br>[BillingFirstCharge.test.ts](file:///d:/Workspace/saas/src/core/use-cases/__tests__/BillingFirstCharge.test.ts)<br>[BillingUseCases.test.ts](file:///d:/Workspace/saas/src/core/use-cases/__tests__/BillingUseCases.test.ts) | • `POST /v1/billing/authorizations/issue` Basic 인증 헤더<br>• `POST /v1/billing/{billingKey}` 정기 결제 승인<br>• `autoCharge: true` 시 1회차 결제 즉시 승인 및 Pro 멤버십 활성화 |
| **일괄 정기 결제 (Cron 대비)** | [ExecuteDueBillingsUseCase.test.ts](file:///d:/Workspace/saas/src/core/use-cases/__tests__/ExecuteDueBillingsUseCase.test.ts) | • 시간(아침, 오후, 밤) 무관하게 당일 종료(23:59:59.999) 기준 모든 ACTIVE 빌링키 조회<br>• 순회 결제 실행 및 30일 주기 연장<br>• 개별 실패 시 타 결제 중단 없이 연속 처리 |
| **권한 게이트 & 라우트 보호** | [NotesPermissionGate.test.tsx](file:///d:/Workspace/saas/src/presentation/components/notes/__tests__/NotesPermissionGate.test.tsx)<br>[RouteProtectionByUsers.test.tsx](file:///d:/Workspace/saas/src/presentation/components/notes/__tests__/RouteProtectionByUsers.test.tsx) | • `test1@test.com` (FREE): 결제 유도 배너, 삭제/생성 권한 잠금<br>• `test2@test.com` (PRO): Pro 뱃지, 노트 CRUD 전체 권한 언락 |
| **UI 및 인터랙션** | [DashboardPage.test.tsx](file:///d:/Workspace/saas/src/presentation/components/dashboard/__tests__/DashboardPage.test.tsx)<br>[NoteEditorPage.test.tsx](file:///d:/Workspace/saas/src/presentation/components/note/__tests__/NoteEditorPage.test.tsx)<br>[BillingPaymentIntegration.test.tsx](file:///d:/Workspace/saas/src/presentation/components/payment/__tests__/BillingPaymentIntegration.test.tsx) | • 카드 등록 모달 30일 주기 고지<br>• 즉시 결제 트리거 및 영수증 렌더링 |

---

## 3. 테스트 실패 시 트러블슈팅 가이드

1. **상태 오염 (State Leakage)으로 인한 테스트 실패:**
   * 증상: 단독 실행 시 통과하나, 전체 테스트 실행 시 특정 노트나 트랜잭션을 찾지 못함.
   * 조치: `vitest.setup.ts`의 `beforeEach`에서 `SupabaseNoteRepository.resetSeed()` 및 저장소 클리어가 동작하는지 확인합니다.
2. **React 19 `act(...)` 경고:**
   * 비동기 상태 변경을 일으키는 사용자 이벤트는 `await userEvent...` 또는 `await waitFor(...)`로 상태 수렴을 대기해야 합니다.
3. **환경 변수 부재로 인한 외부 네트워크 호출:**
   * `TossBillingApiClient`는 `process.env.TOSS_SECRET_KEY`가 없을 때 안전한 Mock fallback을 제공합니다. 단위 테스트 중 실제 외부 API 호출이 필요하지 않은 경우 시크릿 키가 mock 상태인지 확인합니다.
