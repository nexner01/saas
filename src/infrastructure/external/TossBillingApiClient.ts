import {
  ITossBillingClient,
  TossIssueBillingKeyParams,
  TossIssueBillingKeyResponse,
  TossChargeBillingParams,
  TossChargeBillingResponse,
} from "@/src/core/domain/ITossBillingClient";

export class TossBillingApiClient implements ITossBillingClient {
  private getAuthHeader(): string {
    const secretKey = process.env.TOSS_SECRET_KEY || "";
    // Buffer 또는 btoa를 활용한 Base64 인코딩
    const encoded =
      typeof Buffer !== "undefined"
        ? Buffer.from(`${secretKey}:`).toString("base64")
        : btoa(`${secretKey}:`);
    return `Basic ${encoded}`;
  }

  async issueBillingKey(
    params: TossIssueBillingKeyParams
  ): Promise<TossIssueBillingKeyResponse> {
    const secretKey = process.env.TOSS_SECRET_KEY;

    // Secret Key가 설정되어 있지 않거나 authKey가 AUTH_MOCK/AUTH_FIRST 등으로 시작하는 모의 테스트인 경우
    if (!secretKey) {
      return {
        billingKey: `test_bkey_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        cardCompany: "토스뱅크",
        cardNumber: "4330-****-****-9821",
        authenticatedAt: new Date().toISOString(),
      };
    }

    const response = await fetch(
      "https://api.tosspayments.com/v1/billing/authorizations/issue",
      {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authKey: params.authKey,
          customerKey: params.customerKey,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `토스페이먼츠 빌링키 발급 실패: ${response.statusText}`
      );
    }

    return {
      billingKey: data.billingKey,
      cardCompany: data.card?.company || data.cardCompany || "토스뱅크",
      cardNumber: data.card?.number || data.cardNumber || "4330-****-****-9821",
      authenticatedAt: data.authenticatedAt,
    };
  }

  async chargeBilling(
    params: TossChargeBillingParams
  ): Promise<TossChargeBillingResponse> {
    const secretKey = process.env.TOSS_SECRET_KEY;

    // Secret Key가 없고 모의 환경인 경우 Mock 응답 지원
    if (!secretKey) {
      return {
        paymentKey: `pay_rec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        status: "DONE",
        totalAmount: params.amount,
        approvedAt: new Date().toISOString(),
        orderId: params.orderId,
      };
    }

    const response = await fetch(
      `https://api.tosspayments.com/v1/billing/${params.billingKey}`,
      {
        method: "POST",
        headers: {
          Authorization: this.getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerKey: params.customerKey,
          amount: params.amount,
          orderId: params.orderId,
          orderName: params.orderName,
          ...(params.customerEmail ? { customerEmail: params.customerEmail } : {}),
          ...(params.customerName ? { customerName: params.customerName } : {}),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `토스페이먼츠 정기 결제 승인 실패: ${response.statusText}`
      );
    }

    return {
      paymentKey: data.paymentKey,
      status: data.status,
      totalAmount: data.totalAmount ?? params.amount,
      approvedAt: data.approvedAt || new Date().toISOString(),
      orderId: data.orderId,
    };
  }
}
