import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { NotesManagementPage } from "../NotesManagementPage";
import { AuthRepository } from "@/src/infrastructure/repositories/AuthRepository";

// Mock router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/notes",
  useSearchParams: () => ({
    get: () => null,
  }),
}));

describe("Route Protection & Permission by User Account (TDD)", () => {
  let authRepository: AuthRepository;

  beforeEach(() => {
    mockPush.mockClear();
    authRepository = new AuthRepository();
  });

  it("test1@test.com (회원가입만 한 사용자, FREE): 결제 유도 배너 노출, 삭제 버튼 비활성화, 생성 시 결제 유도", async () => {
    // test1 사용자 로그인
    await authRepository.signIn("test1@test.com", "Test123!");

    render(<NotesManagementPage />);

    // 1. 미결제 안내 배너 및 지금 플랜 결제하기 링크 노출 확인
    expect(
      await screen.findByText(/결제 후 모든 노트를 자유롭게 생성, 수정, 삭제하세요/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /지금 플랜 결제하기/i })).toHaveAttribute(
      "href",
      "/payment"
    );

    // 2. Pro 멤버십 활성 뱃지는 노출되지 않아야 함
    expect(screen.queryByText("Pro 멤버십 활성")).not.toBeInTheDocument();

    // 3. 삭제 버튼이 없어야 함
    expect(screen.queryByTitle("노트 삭제")).not.toBeInTheDocument();

    // 4. 새 노트 작성 클릭 시 /payment 로 리디렉션
    const createBtn = screen.getByRole("button", { name: /새 노트 작성/i });
    fireEvent.click(createBtn);
    expect(mockPush).toHaveBeenCalledWith("/payment");
  });

  it("test2@test.com (회원가입 후 결제 완료한 사용자, PRO): 모든 권한 언락, Pro 뱃지, 삭제 버튼 활성화", async () => {
    // test2 사용자 로그인
    await authRepository.signIn("test2@test.com", "Test123!");

    render(<NotesManagementPage />);

    // 1. 미결제 안내 배너가 없어야 함
    await waitFor(() => {
      expect(
        screen.queryByText(/결제 후 모든 노트를 자유롭게 생성, 수정, 삭제하세요/i)
      ).not.toBeInTheDocument();
    });

    // 2. Pro 멤버십 활성 뱃지가 노출되어야 함
    expect(await screen.findByText("Pro 멤버십 활성")).toBeInTheDocument();

    // 3. 노트 삭제 버튼이 노출되어야 함
    const deleteBtns = await screen.findAllByTitle("노트 삭제");
    expect(deleteBtns.length).toBeGreaterThan(0);

    // 4. 삭제 버튼 클릭 시 정상적으로 삭제 수행
    const firstNoteHeading = await screen.findByRole("heading", {
      level: 3,
      name: /2025 디자인 시스템 개편 로드맵/i,
    });
    expect(firstNoteHeading).toBeInTheDocument();

    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          level: 3,
          name: /2025 디자인 시스템 개편 로드맵/i,
        })
      ).not.toBeInTheDocument();
    });
  });

  it("사용자 전환 (test1 -> test2): 실시간으로 권한이 갱신되어 라우트 보호가 해제됨", async () => {
    await authRepository.signIn("test1@test.com", "Test123!");
    render(<NotesManagementPage />);

    expect(
      await screen.findByText(/결제 후 모든 노트를 자유롭게 생성, 수정, 삭제하세요/i)
    ).toBeInTheDocument();

    // test2로 전환
    await authRepository.signIn("test2@test.com", "Test123!");

    await waitFor(() => {
      expect(
        screen.queryByText(/결제 후 모든 노트를 자유롭게 생성, 수정, 삭제하세요/i)
      ).not.toBeInTheDocument();
      expect(screen.getByText("Pro 멤버십 활성")).toBeInTheDocument();
    });
  });
});
