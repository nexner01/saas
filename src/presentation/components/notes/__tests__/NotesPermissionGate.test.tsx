import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { NotesManagementPage } from "../NotesManagementPage";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";

describe("Notes Management Permission Gate (TDD)", () => {
  let subscriptionRepository: SubscriptionRepository;

  beforeEach(() => {
    subscriptionRepository = new SubscriptionRepository();
    subscriptionRepository.reset(); // 미결제 상태로 초기화
  });

  it("shows payment required banner/notice when user has not completed payment", async () => {
    render(<NotesManagementPage />);

    // 미결제 상태 안내 배너 및 결제 업그레이드 링크 노출 확인
    expect(
      await screen.findByText(/결제 후 모든 노트를 자유롭게 생성, 수정, 삭제하세요/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /지금 플랜 결제하기/i })).toHaveAttribute(
      "href",
      "/payment"
    );
  });

  it("unlocks full note CRUD actions after payment is completed (PRO)", async () => {
    // 결제 완료 상태로 변경
    await subscriptionRepository.activatePlan("PRO");

    render(<NotesManagementPage />);

    // 미결제 경고 배너가 사라졌는지 확인
    await waitFor(() => {
      expect(
        screen.queryByText(/결제 후 모든 노트를 자유롭게 생성, 수정, 삭제하세요/i)
      ).not.toBeInTheDocument();
    });

    // Pro 멤버십 활성 뱃지 확인
    expect(screen.getByText("Pro 멤버십 활성")).toBeInTheDocument();

    // 노트 삭제 버튼 노출 및 삭제 확인
    const deleteBtns = await screen.findAllByTitle("노트 삭제");
    expect(deleteBtns.length).toBeGreaterThan(0);

    // 첫 번째 노트의 제목을 기억하고 삭제 클릭
    const firstNoteHeading = await screen.findByRole("heading", { level: 3, name: /2025 디자인 시스템 개편 로드맵/i });
    const firstNoteTitle = firstNoteHeading.textContent;
    fireEvent.click(deleteBtns[0]);

    // 첫 번째 노트가 화면에서 제거되었는지 확인
    await waitFor(() => {
      expect(screen.queryByText(firstNoteTitle!)).not.toBeInTheDocument();
    });
  });
});
