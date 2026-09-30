import { UserPlan } from "./Subscription";

export interface BillingSubscription {
  id: string;
  customerKey: string;
  billingKey: string;
  cardCompany: string;
  cardNumber: string; // 마스킹된 번호 (예: 4330-****-****-1234)
  plan: UserPlan;
  amount: number;
  intervalDays: number; // 기본 30일
  nextBillingDate: string; // ISO String
  lastChargedAt?: string;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export interface IssueBillingKeyInput {
  customerKey: string;
  authKey: string;
  plan: UserPlan;
  amount: number;
  cardCompany?: string;
  cardNumber?: string;
  autoCharge?: boolean; // 빌링키 발급 직후 1회차 결제 자동 승인 여부
}

export type IssueBillingResult = BillingSubscription & {
  billing: BillingSubscription;
  firstCharge?: ChargeBillingResult;
};

export interface ChargeBillingInput {
  customerKey: string;
  orderName: string;
  amount?: number;
}

export interface ChargeBillingResult {
  success: boolean;
  orderId: string;
  paymentKey: string;
  amount: number;
  status: "SUCCESS" | "FAILED";
  nextBillingDate: string;
  chargedAt: string;
}
