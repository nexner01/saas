import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaymentPage } from "../PaymentPage";

describe("PaymentPage Component (TDD)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders plan tiers and switches between monthly and annual billing", async () => {
    const user = userEvent.setup();
    render(<PaymentPage />);

    // 헤더 및 요금제 플랜 카드 확인
    expect(screen.getByText("당신의 생산성을 극대화하는 플랜을 선택하세요")).toBeInTheDocument();
    expect(screen.getByText("스타터")).toBeInTheDocument();
    expect(screen.getByText("프로 (Pro)")).toBeInTheDocument();
    expect(screen.getByText("팀 워크스페이스")).toBeInTheDocument();

    // 초기 상태: 연간 결제 (기본값)
    expect(screen.getByText("₩9,600")).toBeInTheDocument();

    // 월간 결제 토글 클릭
    const monthlyBtn = screen.getByRole("button", { name: /월간 결제/i });
    await user.click(monthlyBtn);

    // 월간 가격으로 변경 확인
    expect(screen.getByText("₩12,000")).toBeInTheDocument();
  });

  it("opens Toss Payments checkout modal when clicking Pro plan start button", async () => {
    render(<PaymentPage />);

    // Pro 플랜 시작하기 버튼 클릭
    const proBtn = screen.getByRole("button", { name: /Pro 플랜 시작하기/i });
    fireEvent.click(proBtn);

    // 토스페이먼츠 정기 결제 빌링 모달 오픈 확인
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/토스페이먼츠 정기 결제 카드 등록/i)).toBeInTheDocument();
    expect(screen.getByText(/30일마다 자동으로 갱신되는 정기 결제/i)).toBeInTheDocument();

    // 모달 취소 버튼 클릭 시 닫힘 확인
    const cancelBtn = screen.getByRole("button", { name: "취소" });
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("toggles FAQ accordion item on click", async () => {
    const user = userEvent.setup();
    render(<PaymentPage />);

    const faqQuestion = screen.getByText("결제 수단은 어떤 것들이 지원되나요?");
    await user.click(faqQuestion);

    expect(
      screen.getByText(/국내 모든 신용\/체크카드, 토스페이, 카카오페이/i)
    ).toBeInTheDocument();
  });
});
