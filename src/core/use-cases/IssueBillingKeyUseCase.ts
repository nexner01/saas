import { IBillingRepository } from "../domain/IBillingRepository";
import { BillingSubscription, IssueBillingKeyInput, IssueBillingResult } from "../domain/Billing";
import { ITossBillingClient } from "../domain/ITossBillingClient";
import { ChargeBillingUseCase } from "./ChargeBillingUseCase";

export class IssueBillingKeyUseCase {
  constructor(
    private billingRepository: IBillingRepository,
    private tossBillingClient?: ITossBillingClient,
    private chargeBillingUseCase?: ChargeBillingUseCase
  ) {}

  async execute(input: IssueBillingKeyInput): Promise<IssueBillingResult> {
    const now = new Date();
    // 기본 결제 주기: 30일
    const intervalDays = 30;
    const nextDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

    let billingKey = `test_bkey_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    let cardCompany = input.cardCompany || "토스뱅크";
    let cardNumber = input.cardNumber || "4330-****-****-9821";

    // 1. 토스페이먼츠 실제 빌링키 발급 API 호출 (클라이언트가 제공된 경우)
    if (this.tossBillingClient) {
      const tossRes = await this.tossBillingClient.issueBillingKey({
        customerKey: input.customerKey,
        authKey: input.authKey,
      });
      billingKey = tossRes.billingKey;
      cardCompany = tossRes.cardCompany || cardCompany;
      cardNumber = tossRes.cardNumber || cardNumber;
    }

    const billing: BillingSubscription = {
      id: `bill_${Date.now()}`,
      customerKey: input.customerKey,
      billingKey,
      cardCompany,
      cardNumber,
      plan: input.plan,
      amount: input.amount,
      intervalDays,
      nextBillingDate: nextDate.toISOString(),
      status: "ACTIVE",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const savedBilling = await this.billingRepository.saveBilling(billing);

    // 2. autoCharge 옵션이 활성화되어 있고 chargeBillingUseCase가 있으면 즉시 첫 결제 실행
    let firstCharge = undefined;
    if (input.autoCharge && this.chargeBillingUseCase) {
      firstCharge = await this.chargeBillingUseCase.execute({
        customerKey: input.customerKey,
        orderName: `Noteflow ${input.plan} 30일 정기 구독 (1회차)`,
        amount: input.amount,
      });
    }

    // 하위 호환성 (savedBilling 필드에 직접 접근 및 result.billing, result.firstCharge 접근 모두 지원)
    return Object.assign({}, savedBilling, {
      billing: savedBilling,
      firstCharge,
    }) as IssueBillingResult;
  }
}
