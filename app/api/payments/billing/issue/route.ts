import { NextResponse } from "next/server";
import { BillingRepository } from "@/src/infrastructure/repositories/BillingRepository";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";
import { TossBillingApiClient } from "@/src/infrastructure/external/TossBillingApiClient";
import { IssueBillingKeyUseCase } from "@/src/core/use-cases/IssueBillingKeyUseCase";
import { ChargeBillingUseCase } from "@/src/core/use-cases/ChargeBillingUseCase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerKey,
      authKey,
      plan = "PRO",
      amount = 19000,
      cardCompany,
      cardNumber,
      autoCharge = true, // 빌링키 발급 후 1회차 결제 즉시 실행 기본 활성화
    } = body;

    if (!customerKey || !authKey) {
      return NextResponse.json(
        { error: "customerKey와 authKey는 필수 항목입니다." },
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

    const issueBillingKeyUseCase = new IssueBillingKeyUseCase(
      billingRepository,
      tossBillingClient,
      chargeBillingUseCase
    );

    const result = await issueBillingKeyUseCase.execute({
      customerKey,
      authKey,
      plan,
      amount,
      cardCompany,
      cardNumber,
      autoCharge,
    });

    return NextResponse.json({
      success: true,
      message: result.firstCharge
        ? "빌링키가 발급되고 첫 정기 결제가 성공적으로 실행되었습니다. (30일 주기 시작)"
        : "빌링키가 성공적으로 발급 및 저장되었습니다.",
      billing: result.billing,
      firstCharge: result.firstCharge,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "빌링키 발급 및 결제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
