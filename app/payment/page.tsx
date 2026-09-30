import { Metadata } from "next";
import { PaymentPage } from "@/src/presentation/components/payment/PaymentPage";

export const metadata: Metadata = {
  title: "Noteflow Workspace - 요금제 및 결제",
  description: "합리적인 요금제로 Noteflow Pro와 팀 워크스페이스의 모든 프리미엄 기능을 시작하세요.",
};

export default function PricingRoute() {
  return <PaymentPage />;
}
