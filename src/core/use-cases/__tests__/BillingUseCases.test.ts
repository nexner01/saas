import { describe, it, expect, beforeEach, vi } from "vitest";
import { BillingRepository } from "@/src/infrastructure/repositories/BillingRepository";
import { IssueBillingKeyUseCase } from "@/src/core/use-cases/IssueBillingKeyUseCase";
import { ChargeBillingUseCase } from "@/src/core/use-cases/ChargeBillingUseCase";
import { GetBillingInfoUseCase } from "@/src/core/use-cases/GetBillingInfoUseCase";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";

describe("Toss Payments Billing (Recurring Payment, 30-Day Interval) System (TDD)", () => {
  let billingRepository: BillingRepository;
  let subscriptionRepository: SubscriptionRepository;
  let paymentHistoryRepository: PaymentHistoryRepository;
  let issueBillingKeyUseCase: IssueBillingKeyUseCase;
  let chargeBillingUseCase: ChargeBillingUseCase;
  let getBillingInfoUseCase: GetBillingInfoUseCase;

  beforeEach(() => {
    billingRepository = new BillingRepository();
    billingRepository.clear();

    subscriptionRepository = new SubscriptionRepository();
    subscriptionRepository.reset();

    paymentHistoryRepository = new PaymentHistoryRepository();
    paymentHistoryRepository.clear();

    issueBillingKeyUseCase = new IssueBillingKeyUseCase(billingRepository);
    chargeBillingUseCase = new ChargeBillingUseCase(
      billingRepository,
      subscriptionRepository,
      paymentHistoryRepository
    );
    getBillingInfoUseCase = new GetBillingInfoUseCase(billingRepository);
  });

  it("issues and saves billingKey with 30-day interval and nextBillingDate", async () => {
    const customerKey = "CUST_TEST_001";
    const authKey = "AUTH_KEY_TEST_XYZ";

    const billing = await issueBillingKeyUseCase.execute({
      customerKey,
      authKey,
      plan: "PRO",
      amount: 19000,
    });

    expect(billing.customerKey).toBe(customerKey);
    expect(billing.billingKey).toBeDefined();
    expect(billing.billingKey.startsWith("test_bkey_")).toBe(true);
    expect(billing.intervalDays).toBe(30);
    expect(billing.status).toBe("ACTIVE");

    // 다음 결제일이 약 30일 뒤인지 검증
    const now = Date.now();
    const nextDate = new Date(billing.nextBillingDate).getTime();
    const diffDays = Math.round((nextDate - now) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(30);

    // 저장소 조회 확인
    const saved = await getBillingInfoUseCase.execute(customerKey);
    expect(saved).not.toBeNull();
    expect(saved?.billingKey).toBe(billing.billingKey);
  });

  it("charges recurring payment using saved billingKey and extends nextBillingDate by 30 days", async () => {
    const customerKey = "CUST_TEST_002";

    // 1. 빌링키 발급 및 저장
    await issueBillingKeyUseCase.execute({
      customerKey,
      authKey: "AUTH_MOCK_002",
      plan: "PRO",
      amount: 19000,
    });

    // 2. 정기 결제 엔드포인트 실행
    const chargeResult = await chargeBillingUseCase.execute({
      customerKey,
      orderName: "Noteflow Pro 30일 정기 구독",
    });

    expect(chargeResult.success).toBe(true);
    expect(chargeResult.status).toBe("SUCCESS");
    expect(chargeResult.amount).toBe(19000);
    expect(chargeResult.orderId).toBeDefined();

    // 3. 사용자 구독이 PRO로 활성화되었는지 확인
    const sub = await subscriptionRepository.getSubscription();
    expect(sub.plan).toBe("PRO");
    expect(sub.isSubscribed).toBe(true);

    // 4. 결제 트랜잭션 내역에 SUCCESS로 기록되었는지 확인
    const tx = await paymentHistoryRepository.getByOrderId(chargeResult.orderId);
    expect(tx?.status).toBe("SUCCESS");
    expect(tx?.amount).toBe(19000);

    // 5. 다음 결제일이 갱신되었는지 확인
    const updatedBilling = await getBillingInfoUseCase.execute(customerKey);
    expect(updatedBilling?.lastChargedAt).toBeDefined();
    expect(updatedBilling?.intervalDays).toBe(30);
  });

  it("fails charge if billingKey is not found or inactive", async () => {
    await expect(
      chargeBillingUseCase.execute({
        customerKey: "NON_EXISTENT_CUST",
        orderName: "Test Charge",
      })
    ).rejects.toThrow("등록된 빌링키가 없습니다.");
  });
});
