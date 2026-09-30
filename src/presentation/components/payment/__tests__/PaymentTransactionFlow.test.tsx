import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { TossPaymentWidgetModal } from "../TossPaymentWidgetModal";
import { PaymentSuccessPage } from "../PaymentSuccessPage";
import { PaymentFailPage } from "../PaymentFailPage";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "orderId") return "ORDER_MOCK_FAIL_123";
      if (key === "code") return "PAY_PROCESS_ABORTED";
      if (key === "message") return "사용자에 의해 결제가 중단되었습니다.";
      if (key === "amount") return "19000";
      return null;
    },
  }),
}));

describe("Payment Transaction Flow & Status Integration (TDD)", () => {
  let paymentRepo: PaymentHistoryRepository;

  beforeEach(() => {
    paymentRepo = new PaymentHistoryRepository();
    paymentRepo.clear();
    mockPush.mockClear();
  });

  it("saves CANCELLED state when user closes payment modal using the cancel button", async () => {
    const handleClose = vi.fn();

    render(
      <TossPaymentWidgetModal
        isOpen={true}
        onClose={handleClose}
        orderName="Noteflow Pro (월간)"
        amount={19000}
        planName="PRO"
      />
    );

    // 모달 내 취소 버튼 클릭
    const cancelBtn = screen.getByRole("button", { name: "취소" });
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalled();

    // 저장소에 CANCELLED 상태가 기록되었는지 확인
    await waitFor(async () => {
      const latest = await paymentRepo.getLatest();
      expect(latest).not.toBeNull();
      expect(latest?.status).toBe("CANCELLED");
      expect(latest?.orderName).toBe("Noteflow Pro (월간)");
    });
  });

  it("saves FAILED state and displays error info when payment fails", async () => {
    render(<PaymentFailPage />);

    // 실패 안내 문구 및 에러 코드 노출 확인
    expect(
      await screen.findByText(/결제에 실패하였습니다/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/PAY_PROCESS_ABORTED/i)).toBeInTheDocument();
    expect(
      screen.getByText(/사용자에 의해 결제가 중단되었습니다/i)
    ).toBeInTheDocument();

    // 저장소에 FAILED 상태가 기록되었는지 확인
    await waitFor(async () => {
      const tx = await paymentRepo.getByOrderId("ORDER_MOCK_FAIL_123");
      expect(tx).not.toBeNull();
      expect(tx?.status).toBe("FAILED");
      expect(tx?.errorCode).toBe("PAY_PROCESS_ABORTED");
    });
  });

  it("saves SUCCESS state when payment succeeds", async () => {
    // 미리 PENDING 트랜잭션 시드
    await paymentRepo.createTransaction({
      orderId: "ORDER_SUCCESS_999",
      orderName: "Noteflow Pro",
      amount: 19000,
      plan: "PRO",
    });

    render(<PaymentSuccessPage />);

    await waitFor(async () => {
      const all = await paymentRepo.getAll();
      const successTx = all.find((tx) => tx.status === "SUCCESS");
      expect(successTx).toBeDefined();
    });
  });
});
