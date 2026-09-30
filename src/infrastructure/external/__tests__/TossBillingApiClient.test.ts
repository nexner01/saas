import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { TossBillingApiClient } from "@/src/infrastructure/external/TossBillingApiClient";

describe("TossBillingApiClient (TDD)", () => {
  const originalFetch = global.fetch;
  const mockSecretKey = "test_sk_mock_1234567890";

  beforeEach(() => {
    process.env.TOSS_SECRET_KEY = mockSecretKey;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.TOSS_SECRET_KEY;
  });

  it("calls Toss Payments issueBillingKey API with basic authorization header and correct payload", async () => {
    const mockResponse = {
      mId: "tosspayments",
      customerKey: "CUST_TEST_01",
      authenticatedAt: "2026-09-30T12:00:00+09:00",
      method: "카드",
      billingKey: "bkey_real_mock_123",
      card: {
        company: "현대",
        number: "4330-****-****-1234",
        cardType: "신용",
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const client = new TossBillingApiClient();
    const result = await client.issueBillingKey({
      customerKey: "CUST_TEST_01",
      authKey: "AUTH_KEY_XYZ",
    });

    expect(result.billingKey).toBe("bkey_real_mock_123");
    expect(result.cardCompany).toBe("현대");
    expect(result.cardNumber).toBe("4330-****-****-1234");

    // fetch 호출 인자 검증
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.tosspayments.com/v1/billing/authorizations/issue",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Basic /),
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          authKey: "AUTH_KEY_XYZ",
          customerKey: "CUST_TEST_01",
        }),
      })
    );
  });

  it("calls Toss Payments chargeBilling API to execute recurring charge", async () => {
    const mockChargeResponse = {
      mId: "tosspayments",
      version: "2022-11-16",
      paymentKey: "pay_key_real_mock_789",
      status: "DONE",
      orderId: "NF-REC-ORDER-123",
      orderName: "Noteflow Pro 30일 정기 구독",
      totalAmount: 19000,
      approvedAt: "2026-09-30T12:00:01+09:00",
      card: {
        number: "4330-****-****-1234",
        company: "현대",
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockChargeResponse,
    });

    const client = new TossBillingApiClient();
    const result = await client.chargeBilling({
      billingKey: "bkey_real_mock_123",
      customerKey: "CUST_TEST_01",
      amount: 19000,
      orderId: "NF-REC-ORDER-123",
      orderName: "Noteflow Pro 30일 정기 구독",
    });

    expect(result.paymentKey).toBe("pay_key_real_mock_789");
    expect(result.status).toBe("DONE");
    expect(result.totalAmount).toBe(19000);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.tosspayments.com/v1/billing/bkey_real_mock_123",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Basic /),
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          customerKey: "CUST_TEST_01",
          amount: 19000,
          orderId: "NF-REC-ORDER-123",
          orderName: "Noteflow Pro 30일 정기 구독",
        }),
      })
    );
  });

  it("handles Toss Payments API failure gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        code: "INVALID_CARD_NUMBER",
        message: "유효하지 않은 카드 번호입니다.",
      }),
    });

    const client = new TossBillingApiClient();
    await expect(
      client.chargeBilling({
        billingKey: "bkey_invalid",
        customerKey: "CUST_ERR",
        amount: 19000,
        orderId: "NF-ERR-1",
        orderName: "Error Test",
      })
    ).rejects.toThrow("유효하지 않은 카드 번호입니다.");
  });
});
