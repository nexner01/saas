import { describe, it, expect, beforeEach } from "vitest";
import { BillingRepository } from "@/src/infrastructure/repositories/BillingRepository";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";
import { IssueBillingKeyUseCase } from "@/src/core/use-cases/IssueBillingKeyUseCase";
import { ChargeBillingUseCase } from "@/src/core/use-cases/ChargeBillingUseCase";
import { POST as issuePost } from "@/app/api/payments/billing/issue/route";

describe("Issue BillingKey with Immediate First Charge (TDD)", () => {
  let billingRepository: BillingRepository;
  let subscriptionRepository: SubscriptionRepository;
  let paymentHistoryRepository: PaymentHistoryRepository;
  let chargeBillingUseCase: ChargeBillingUseCase;
  let issueBillingKeyUseCase: IssueBillingKeyUseCase;

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

    issueBillingKeyUseCase = new IssueBillingKeyUseCase(
      billingRepository,
      undefined,
      chargeBillingUseCase
    );
  });

  it("issues billingKey AND immediately executes first charge when autoCharge is true", async () => {
    const customerKey = "CUST_FIRST_CHARGE_001";

    const result = await issueBillingKeyUseCase.execute({
      customerKey,
      authKey: "AUTH_FIRST_001",
      plan: "PRO",
      amount: 19000,
      autoCharge: true,
    });

    // 1. 빌링 정보 저장 확인
    expect(result.billing.customerKey).toBe(customerKey);
    expect(result.billing.status).toBe("ACTIVE");
    expect(result.billing.intervalDays).toBe(30);

    // 2. 첫 결제(1회차) 결과가 즉시 함께 반환되는지 확인
    expect(result.firstCharge).toBeDefined();
    expect(result.firstCharge?.success).toBe(true);
    expect(result.firstCharge?.status).toBe("SUCCESS");
    expect(result.firstCharge?.amount).toBe(19000);

    // 3. 사용자 구독이 PRO로 활성화되었는지 확인
    const sub = await subscriptionRepository.getSubscription();
    expect(sub.plan).toBe("PRO");
    expect(sub.isSubscribed).toBe(true);

    // 4. 결제 내역(1회차 정기결제)이 기록되었는지 확인
    const tx = await paymentHistoryRepository.getByOrderId(result.firstCharge!.orderId);
    expect(tx?.status).toBe("SUCCESS");
  });

  it("POST /api/payments/billing/issue executes immediate first charge by default", async () => {
    const req = new Request("http://localhost:3000/api/payments/billing/issue", {
      method: "POST",
      body: JSON.stringify({
        customerKey: "CUST_FIRST_API_001",
        authKey: "AUTH_FIRST_API_001",
        plan: "PRO",
        amount: 19000,
        autoCharge: true,
      }),
    });

    const res = await issuePost(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.billing).toBeDefined();
    expect(json.firstCharge).toBeDefined();
    expect(json.firstCharge.status).toBe("SUCCESS");
    expect(json.message).toContain("첫 정기 결제가 성공적으로 실행");
  });
});
