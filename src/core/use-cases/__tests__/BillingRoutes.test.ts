import { describe, it, expect, beforeEach } from "vitest";
import { POST as issuePost } from "@/app/api/payments/billing/issue/route";
import { POST as chargePost } from "@/app/api/payments/billing/charge/route";
import { BillingRepository } from "@/src/infrastructure/repositories/BillingRepository";

describe("Billing API Endpoints (issue & charge) (TDD)", () => {
  beforeEach(() => {
    new BillingRepository().clear();
  });

  it("POST /api/payments/billing/issue registers billingKey with 30-day interval", async () => {
    const req = new Request("http://localhost:3000/api/payments/billing/issue", {
      method: "POST",
      body: JSON.stringify({
        customerKey: "CUST_API_001",
        authKey: "AUTH_API_XYZ",
        plan: "PRO",
        amount: 19000,
        cardCompany: "신한카드",
        cardNumber: "5365-****-****-1092",
      }),
    });

    const res = await issuePost(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.billing.customerKey).toBe("CUST_API_001");
    expect(json.billing.intervalDays).toBe(30);
    expect(json.billing.billingKey).toBeDefined();
  });

  it("POST /api/payments/billing/charge executes recurring charge and updates nextBillingDate", async () => {
    // 1. 먼저 빌링키 발급
    const issueReq = new Request("http://localhost:3000/api/payments/billing/issue", {
      method: "POST",
      body: JSON.stringify({
        customerKey: "CUST_API_002",
        authKey: "AUTH_API_XYZ2",
        plan: "PRO",
        amount: 19000,
      }),
    });
    await issuePost(issueReq);

    // 2. 정기 결제 실행 엔드포인트 호출
    const chargeReq = new Request("http://localhost:3000/api/payments/billing/charge", {
      method: "POST",
      body: JSON.stringify({
        customerKey: "CUST_API_002",
        orderName: "Noteflow Pro 30일 정기 구독",
      }),
    });

    const chargeRes = await chargePost(chargeReq);
    expect(chargeRes.status).toBe(200);

    const json = await chargeRes.json();
    expect(json.success).toBe(true);
    expect(json.charge.status).toBe("SUCCESS");
    expect(json.charge.amount).toBe(19000);
    expect(json.charge.nextBillingDate).toBeDefined();
  });
});
