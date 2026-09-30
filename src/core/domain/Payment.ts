export type BillingCycle = "monthly" | "annual";

export type PlanType = "STARTER" | "PRO" | "TEAM";

export interface PlanPricing {
  type: PlanType;
  name: string;
  monthlyPrice: number;
  annualMonthlyPrice: number; // 연간 결제 시 월 환산가
  annualTotalPrice: number;
  badge?: string;
  isPopular?: boolean;
}

export const PLAN_PRICING: Record<PlanType, PlanPricing> = {
  STARTER: {
    type: "STARTER",
    name: "스타터",
    monthlyPrice: 0,
    annualMonthlyPrice: 0,
    annualTotalPrice: 0,
  },
  PRO: {
    type: "PRO",
    name: "프로 (Pro)",
    monthlyPrice: 12000,
    annualMonthlyPrice: 9600,
    annualTotalPrice: 115200,
    badge: "BEST VALUE",
    isPopular: true,
  },
  TEAM: {
    type: "TEAM",
    name: "팀 워크스페이스",
    monthlyPrice: 28000,
    annualMonthlyPrice: 22400,
    annualTotalPrice: 268800,
    badge: "COLLAB",
  },
};

export interface PaymentRequestData {
  planType: PlanType;
  billingCycle: BillingCycle;
  amount: number;
  orderName: string;
  customerName: string;
  customerEmail: string;
}

export interface PaymentReceipt {
  orderId: string;
  orderName: string;
  paymentKey: string;
  amount: number;
  approvedAt: string;
  method?: string;
  taxAmount?: number;
  supplyAmount?: number;
}
