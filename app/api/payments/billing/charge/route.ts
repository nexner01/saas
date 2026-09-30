import { NextResponse } from "next/server";
import { BillingRepository } from "@/src/infrastructure/repositories/BillingRepository";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";
import { TossBillingApiClient } from "@/src/infrastructure/external/TossBillingApiClient";
import { ChargeBillingUseCase } from "@/src/core/use-cases/ChargeBillingUseCase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerKey, orderName = "Noteflow Pro 30일 정기 구독", amount } = body;

    if (!customerKey) {
      return NextResponse.json(
        { error: "customerKey가 누락되었습니다." },
        { status: 400 }
      );
    }

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

    const result = await chargeBillingUseCase.execute({
      customerKey,
      orderName,
      amount,
    });

    return NextResponse.json({
      success: true,
      message: "정기 결제가 성공적으로 실행되었습니다. 30일 멤버십이 갱신되었습니다.",
      charge: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "정기 결제 실행 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
