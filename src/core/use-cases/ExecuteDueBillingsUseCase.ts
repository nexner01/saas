import { IBillingRepository } from "../domain/IBillingRepository";
import { ChargeBillingUseCase } from "./ChargeBillingUseCase";

export interface ExecuteDueBillingsInput {
  targetDate?: Date;
  orderNamePrefix?: string;
}

export interface IndividualChargeResult {
  customerKey: string;
  billingKey: string;
  amount: number;
  success: boolean;
  orderId?: string;
  paymentKey?: string;
  error?: string;
}

export interface ExecuteDueBillingsResult {
  totalCount: number;
  successCount: number;
  failureCount: number;
  results: IndividualChargeResult[];
  executedAt: string;
}

export class ExecuteDueBillingsUseCase {
  constructor(
    private billingRepository: IBillingRepository,
    private chargeBillingUseCase: ChargeBillingUseCase
  ) {}

  /**
   * 시간과 관계없이 오늘(또는 지정일) 결제해야 하는 모든 ACTIVE 빌링키를 조회하고,
   * 이미 구현되어 있는 chargeBillingUseCase를 실행하여 일괄 정기 결제를 수행합니다.
   * Vercel Cron job 등 스케줄러 환경에서 안전하게 호출할 수 있도록 개별 실패 시에도 연속 실행됩니다.
   */
  async execute(input: ExecuteDueBillingsInput = {}): Promise<ExecuteDueBillingsResult> {
    const targetDate = input.targetDate || new Date();
    const orderNamePrefix = input.orderNamePrefix || "Noteflow 정기 구독 자동 갱신";

    // 1. 시간과 관계없이 오늘 결제 대상인 모든 빌링키 조회
    const dueBillings = await this.billingRepository.findDueBillings(targetDate);

    const results: IndividualChargeResult[] = [];
    let successCount = 0;
    let failureCount = 0;

    // 2. 각 빌링키에 대해 정기 결제 함수 실행
    for (const billing of dueBillings) {
      try {
        const chargeRes = await this.chargeBillingUseCase.execute({
          customerKey: billing.customerKey,
          orderName: `${orderNamePrefix} (${billing.plan})`,
          amount: billing.amount,
        });

        results.push({
          customerKey: billing.customerKey,
          billingKey: billing.billingKey,
          amount: billing.amount,
          success: true,
          orderId: chargeRes.orderId,
          paymentKey: chargeRes.paymentKey,
        });
        successCount++;
      } catch (error: any) {
        results.push({
          customerKey: billing.customerKey,
          billingKey: billing.billingKey,
          amount: billing.amount,
          success: false,
          error: error.message || "정기 결제 승인 실패",
        });
        failureCount++;
      }
    }

    return {
      totalCount: dueBillings.length,
      successCount,
      failureCount,
      results,
      executedAt: new Date().toISOString(),
    };
  }
}

/**
 * Cron Job 또는 외부 스케줄러에서 한 줄로 실행할 수 있는 기본 팩토리 함수
 */
export async function executeDueBillings(
  targetDate: Date = new Date(),
  orderNamePrefix?: string
): Promise<ExecuteDueBillingsResult> {
  const { BillingRepository } = await import(
    "@/src/infrastructure/repositories/BillingRepository"
  );
  const { SubscriptionRepository } = await import(
    "@/src/infrastructure/repositories/SubscriptionRepository"
  );
  const { PaymentHistoryRepository } = await import(
    "@/src/infrastructure/repositories/PaymentHistoryRepository"
  );
  const { TossBillingApiClient } = await import(
    "@/src/infrastructure/external/TossBillingApiClient"
  );

  const billingRepository = new BillingRepository();
  const subscriptionRepository = new SubscriptionRepository();
  const paymentHistoryRepository = new PaymentHistoryRepository();
  const tossBillingClient = new TossBillingApiClient();

  const chargeBillingUseCase = new ChargeBillingUseCase(
    billingRepository,
    subscriptionRepository,
    paymentHistoryRepository,
    tossBillingClient
  );

  const useCase = new ExecuteDueBillingsUseCase(
    billingRepository,
    chargeBillingUseCase
  );
  return await useCase.execute({ targetDate, orderNamePrefix });
}
