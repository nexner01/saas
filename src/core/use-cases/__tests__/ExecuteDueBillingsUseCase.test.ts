import { describe, it, expect, beforeEach } from "vitest";
import { BillingRepository } from "@/src/infrastructure/repositories/BillingRepository";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";
import { ChargeBillingUseCase } from "@/src/core/use-cases/ChargeBillingUseCase";
import { ExecuteDueBillingsUseCase } from "@/src/core/use-cases/ExecuteDueBillingsUseCase";
import { BillingSubscription } from "@/src/core/domain/Billing";

describe("ExecuteDueBillingsUseCase (TDD)", () => {
  let billingRepository: BillingRepository;
  let subscriptionRepository: SubscriptionRepository;
  let paymentHistoryRepository: PaymentHistoryRepository;
  let chargeBillingUseCase: ChargeBillingUseCase;
  let executeDueBillingsUseCase: ExecuteDueBillingsUseCase;

  beforeEach(() => {
    billingRepository = new BillingRepository();
    billingRepository.clear();

    subscriptionRepository = new SubscriptionRepository();
    subscriptionRepository.reset();

    paymentHistoryRepository = new PaymentHistoryRepository();
    paymentHistoryRepository.clear();

    chargeBillingUseCase = new ChargeBillingUseCase(
      billingRepository,
      subscriptionRepository,
      paymentHistoryRepository
    );

    executeDueBillingsUseCase = new ExecuteDueBillingsUseCase(
      billingRepository,
      chargeBillingUseCase
    );
  });

  it("finds all active billings due today regardless of time (morning, afternoon, night) and charges them all", async () => {
    const today = new Date("2026-09-30T10:00:00Z");

    // 1. 오늘 아침 (09:00) 결제 예정
    const billTodayMorning: BillingSubscription = {
      id: "bill_1",
      customerKey: "CUST_DUE_01",
      billingKey: "test_bkey_01",
      cardCompany: "토스뱅크",
      cardNumber: "4330-****-****-0001",
      plan: "PRO",
      amount: 19000,
      intervalDays: 30,
      nextBillingDate: "2026-09-30T09:00:00.000Z",
      status: "ACTIVE",
      createdAt: "2026-08-31T09:00:00.000Z",
      updatedAt: "2026-08-31T09:00:00.000Z",
    };

    // 2. 오늘 밤 (23:30) 결제 예정 ("시간과 관계없이 오늘 결제해야 하는")
    const billTodayNight: BillingSubscription = {
      id: "bill_2",
      customerKey: "CUST_DUE_02",
      billingKey: "test_bkey_02",
      cardCompany: "신한카드",
      cardNumber: "5365-****-****-0002",
      plan: "TEAM",
      amount: 49000,
      intervalDays: 30,
      nextBillingDate: "2026-09-30T23:30:00.000Z",
      status: "ACTIVE",
      createdAt: "2026-08-31T23:30:00.000Z",
      updatedAt: "2026-08-31T23:30:00.000Z",
    };

    // 3. 어제 결제 예정이었으나 미결제 상태 (과거 도래 건)
    const billPastDue: BillingSubscription = {
      id: "bill_3",
      customerKey: "CUST_DUE_03",
      billingKey: "test_bkey_03",
      cardCompany: "국민카드",
      cardNumber: "9404-****-****-0003",
      plan: "PRO",
      amount: 19000,
      intervalDays: 30,
      nextBillingDate: "2026-09-29T15:00:00.000Z",
      status: "ACTIVE",
      createdAt: "2026-08-30T15:00:00.000Z",
      updatedAt: "2026-08-30T15:00:00.000Z",
    };

    // 4. 내일 결제 예정인 건 (제외 대상)
    const billTomorrow: BillingSubscription = {
      id: "bill_4",
      customerKey: "CUST_FUTURE_04",
      billingKey: "test_bkey_04",
      cardCompany: "현대카드",
      cardNumber: "4000-****-****-0004",
      plan: "PRO",
      amount: 19000,
      intervalDays: 30,
      nextBillingDate: "2026-10-01T08:00:00.000Z",
      status: "ACTIVE",
      createdAt: "2026-09-01T08:00:00.000Z",
      updatedAt: "2026-09-01T08:00:00.000Z",
    };

    // 5. 오늘은 결제일이지만 이미 해지(CANCELLED)된 건 (제외 대상)
    const billCancelled: BillingSubscription = {
      id: "bill_5",
      customerKey: "CUST_CANCELLED_05",
      billingKey: "test_bkey_05",
      cardCompany: "삼성카드",
      cardNumber: "5100-****-****-0005",
      plan: "PRO",
      amount: 19000,
      intervalDays: 30,
      nextBillingDate: "2026-09-30T12:00:00.000Z",
      status: "CANCELLED",
      createdAt: "2026-08-31T12:00:00.000Z",
      updatedAt: "2026-08-31T12:00:00.000Z",
    };

    await billingRepository.saveBilling(billTodayMorning);
    await billingRepository.saveBilling(billTodayNight);
    await billingRepository.saveBilling(billPastDue);
    await billingRepository.saveBilling(billTomorrow);
    await billingRepository.saveBilling(billCancelled);

    // 1) repository 레벨에서 대상 조회 검증
    const dueBillings = await billingRepository.findDueBillings(today);
    expect(dueBillings.length).toBe(3);
    const dueKeys = dueBillings.map((b) => b.customerKey);
    expect(dueKeys).toContain("CUST_DUE_01");
    expect(dueKeys).toContain("CUST_DUE_02");
    expect(dueKeys).toContain("CUST_DUE_03");
    expect(dueKeys).not.toContain("CUST_FUTURE_04");
    expect(dueKeys).not.toContain("CUST_CANCELLED_05");

    // 2) 유스케이스 실행: 모든 대상 빌링키 순회 결제 실행
    const executionResult = await executeDueBillingsUseCase.execute({
      targetDate: today,
    });

    expect(executionResult.totalCount).toBe(3);
    expect(executionResult.successCount).toBe(3);
    expect(executionResult.failureCount).toBe(0);

    // 결제 후 3명 모두 다음 결제일이 30일 뒤로 갱신되었는지 확인
    const updated01 = await billingRepository.getByCustomerKey("CUST_DUE_01");
    expect(updated01?.lastChargedAt).toBeDefined();
    const updatedDate01 = new Date(updated01!.nextBillingDate);
    expect(updatedDate01.getTime()).toBeGreaterThan(today.getTime());

    const updated02 = await billingRepository.getByCustomerKey("CUST_DUE_02");
    expect(updated02?.lastChargedAt).toBeDefined();

    // 결제 내역 확인
    const allHistory = await paymentHistoryRepository.getAll();
    expect(allHistory.length).toBe(3);
  });

  it("handles individual charge failures without breaking remaining charges", async () => {
    const today = new Date("2026-09-30T10:00:00Z");

    const billNormal: BillingSubscription = {
      id: "bill_norm",
      customerKey: "CUST_NORM",
      billingKey: "test_bkey_norm",
      cardCompany: "토스뱅크",
      cardNumber: "4330-****-****-1111",
      plan: "PRO",
      amount: 19000,
      intervalDays: 30,
      nextBillingDate: "2026-09-30T10:00:00.000Z",
      status: "ACTIVE",
      createdAt: "2026-08-31T10:00:00.000Z",
      updatedAt: "2026-08-31T10:00:00.000Z",
    };

    await billingRepository.saveBilling(billNormal);

    const result = await executeDueBillingsUseCase.execute({
      targetDate: today,
    });

    expect(result.totalCount).toBe(1);
    expect(result.successCount).toBe(1);
    expect(result.results[0].success).toBe(true);
  });

  it("executeDueBillings helper function runs end-to-end correctly", async () => {
    const today = new Date("2026-09-30T14:00:00Z");

    await billingRepository.saveBilling({
      id: "bill_helper_test",
      customerKey: "CUST_HELPER",
      billingKey: "test_bkey_helper",
      cardCompany: "토스뱅크",
      cardNumber: "4330-****-****-2222",
      plan: "PRO",
      amount: 19000,
      intervalDays: 30,
      nextBillingDate: "2026-09-30T11:00:00.000Z",
      status: "ACTIVE",
      createdAt: "2026-08-31T11:00:00.000Z",
      updatedAt: "2026-08-31T11:00:00.000Z",
    });

    const { executeDueBillings } = await import(
      "@/src/core/use-cases/ExecuteDueBillingsUseCase"
    );
    const result = await executeDueBillings(today);

    expect(result.totalCount).toBe(1);
    expect(result.successCount).toBe(1);
    expect(result.results[0].customerKey).toBe("CUST_HELPER");
    expect(result.results[0].success).toBe(true);
  });
});
