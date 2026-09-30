import { IBillingRepository } from "../domain/IBillingRepository";
import { ISubscriptionRepository } from "../domain/ISubscriptionRepository";
import { IPaymentHistoryRepository } from "../domain/IPaymentHistoryRepository";
import { ChargeBillingInput, ChargeBillingResult } from "../domain/Billing";
import { ITossBillingClient } from "../domain/ITossBillingClient";

export class ChargeBillingUseCase {
  constructor(
    private billingRepository: IBillingRepository,
    private subscriptionRepository: ISubscriptionRepository,
    private paymentHistoryRepository: IPaymentHistoryRepository,
    private tossBillingClient?: ITossBillingClient
  ) {}

  async execute(input: ChargeBillingInput): Promise<ChargeBillingResult> {
    const billing = await this.billingRepository.getByCustomerKey(input.customerKey);

    if (!billing || billing.status !== "ACTIVE") {
      throw new Error("등록된 빌링키가 없습니다. 카드를 먼저 등록해 주세요.");
    }

    const orderId = `NF-REC-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const chargeAmount = input.amount || billing.amount;
    const now = new Date();

    // 기본 결제 주기 30일: 다음 결제일 30일 연장
    const intervalDays = billing.intervalDays || 30;
    const nextBillingDate = new Date(
      now.getTime() + intervalDays * 24 * 60 * 60 * 1000
    ).toISOString();

    // 1. 결제 트랜잭션 PENDING/생성 기록
    await this.paymentHistoryRepository.createTransaction({
      orderId,
      orderName: input.orderName,
      amount: chargeAmount,
      plan: billing.plan,
    });

    let paymentKey = `pay_rec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    try {
      // 2. 토스페이먼츠 Billing API 승인 요청 (클라이언트가 주입된 경우 실제 통신)
      if (this.tossBillingClient) {
        const tossRes = await this.tossBillingClient.chargeBilling({
          billingKey: billing.billingKey,
          customerKey: billing.customerKey,
          amount: chargeAmount,
          orderId,
          orderName: input.orderName,
        });
        if (tossRes.paymentKey) {
          paymentKey = tossRes.paymentKey;
        }
      }

      // 3. 결제 트랜잭션 SUCCESS 업데이트
      await this.paymentHistoryRepository.updateTransactionStatus(
        orderId,
        "SUCCESS",
        { paymentKey }
      );

      // 4. 사용자 멤버십 플랜 활성화
      await this.subscriptionRepository.activatePlan(billing.plan, orderId);

      // 5. 빌링 정보에 마지막 결제일 및 다음 결제일(30일 후) 갱신
      await this.billingRepository.updateNextBillingDate(
        billing.customerKey,
        nextBillingDate,
        now.toISOString()
      );

      return {
        success: true,
        status: "SUCCESS",
        orderId,
        paymentKey,
        amount: chargeAmount,
        nextBillingDate,
        chargedAt: now.toISOString(),
      };
    } catch (error: any) {
      // 결제 실패 시 FAILED 기록 후 에러 전파
      await this.paymentHistoryRepository.updateTransactionStatus(
        orderId,
        "FAILED",
        { failureReason: error.message }
      );
      throw error;
    }
  }
}
