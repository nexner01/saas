export interface TossIssueBillingKeyParams {
  customerKey: string;
  authKey: string;
}

export interface TossIssueBillingKeyResponse {
  billingKey: string;
  cardCompany: string;
  cardNumber: string;
  authenticatedAt?: string;
}

export interface TossChargeBillingParams {
  billingKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
}

export interface TossChargeBillingResponse {
  paymentKey: string;
  status: string;
  totalAmount: number;
  approvedAt: string;
  orderId?: string;
}

export interface ITossBillingClient {
  issueBillingKey(params: TossIssueBillingKeyParams): Promise<TossIssueBillingKeyResponse>;
  chargeBilling(params: TossChargeBillingParams): Promise<TossChargeBillingResponse>;
}
