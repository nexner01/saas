import { UserPlan } from "./Subscription";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export interface PaymentTransaction {
  id: string;
  orderId: string;
  orderName: string;
  amount: number;
  plan: UserPlan;
  status: PaymentStatus;
  paymentKey?: string;
  errorCode?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StartPaymentInput {
  orderId: string;
  orderName: string;
  amount: number;
  plan: UserPlan;
}
