import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PaymentSuccessPage } from "../PaymentSuccessPage";

describe("PaymentSuccessPage Component (TDD)", () => {
  it("renders payment success details and receipt breakdown", () => {
    render(<PaymentSuccessPage orderId="NF-20250515-883492" amount={115200} />);

    // 성공 헤더 확인
    expect(screen.getByText("결제가 성공적으로 완료되었습니다!")).toBeInTheDocument();
    expect(screen.getByText("NF-20250515-883492")).toBeInTheDocument();

    // 금액 정보 확인
    expect(screen.getByText("₩115,200")).toBeInTheDocument();

    // Pro 권한 활성화 안내 확인
    expect(screen.getByText("무제한 기기 동시 연결 및 동기화")).toBeInTheDocument();
    const workspaceLinks = screen.getAllByRole("link", { name: /내 워크스페이스로 이동하기/i });
    expect(workspaceLinks.length).toBeGreaterThan(0);
    expect(workspaceLinks[0]).toHaveAttribute("href", "/dashboard");
  });

  it("handles copy order id and print actions", async () => {
    const user = userEvent.setup();
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});

    render(<PaymentSuccessPage orderId="NF-99999" amount={115200} />);

    const copyBtn = screen.getByRole("button", { name: /주문번호 복사/i });
    await user.click(copyBtn);
    expect(await screen.findByText(/주문번호 복사됨!/i)).toBeInTheDocument();

    const printBtn = screen.getByRole("button", { name: /영수증 인쇄/i });
    await user.click(printBtn);
    expect(printSpy).toHaveBeenCalled();
  });
});
