import { Metadata } from "next";
import { PaymentSuccessPage } from "@/src/presentation/components/payment/PaymentSuccessPage";

export const metadata: Metadata = {
  title: "Noteflow Workspace - 결제 완료",
  description: "결제가 성공적으로 완료되었습니다. Pro 멤버십 혜택을 즉시 이용하세요.",
};

interface PaymentSuccessRouteProps {
  searchParams: Promise<{
    orderId?: string;
    amount?: string;
    plan?: string;
    paymentKey?: string;
  }>;
}

export default async function PaymentSuccessRoute({ searchParams }: PaymentSuccessRouteProps) {
  const params = await searchParams;
  const orderId = params.orderId || `NF-${Date.now().toString().slice(-8)}`;
  const amount = params.amount ? parseInt(params.amount, 10) : 115200;
  const planName = params.plan || "Noteflow Pro 연간 멤버십 (1년)";
  const paymentKey = params.paymentKey;

  return (
    <PaymentSuccessPage
      orderId={orderId}
      amount={amount}
      planName={planName}
      paymentKey={paymentKey}
    />
  );
}
