import { PaymentFailPage } from "@/src/presentation/components/payment/PaymentFailPage";

export const metadata = {
  title: "결제 실패 - Noteflow",
  description: "결제 처리 중 오류가 발생하였습니다.",
};

export default function PaymentFailRoute() {
  return <PaymentFailPage />;
}
