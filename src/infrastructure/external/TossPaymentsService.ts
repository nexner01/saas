import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

export const TOSS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

export interface TossPaymentRequestOptions {
  orderId: string;
  orderName: string;
  amount: number;
  customerName?: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
}

export class TossPaymentsService {
  private clientKey: string;

  constructor(clientKey: string = TOSS_CLIENT_KEY) {
    this.clientKey = clientKey;
  }

  /**
   * 토스페이먼츠 결제위젯 인스턴스를 초기화합니다.
   */
  async getWidgets(customerKey: string = ANONYMOUS) {
    if (typeof window === "undefined") {
      throw new Error("TossPayments SDK can only be initialized on the client side.");
    }

    const tossPayments = await loadTossPayments(this.clientKey);
    return tossPayments.widgets({ customerKey });
  }
}
