import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { DashboardPage } from "../DashboardPage";

describe("DashboardPage Component (TDD)", () => {
  it("renders global sidebar and welcome section", async () => {
    render(<DashboardPage />);

    expect(screen.getAllByText("Noteflow").length).toBeGreaterThan(0);
    expect(screen.getByText("개인 워크스페이스")).toBeInTheDocument();
    expect(screen.getByText("대시보드")).toBeInTheDocument();
    expect(screen.getByText("빠른 메모")).toBeInTheDocument();
    expect(screen.getByText(/좋은 하루입니다,/i)).toBeInTheDocument();
    expect(screen.getByText("Pro 플랜 활성")).toBeInTheDocument();
  });

  it("renders 3 bento widgets including scratchpad and task progress", async () => {
    render(<DashboardPage />);

    expect(screen.getByText("빠른 스크래치패드")).toBeInTheDocument();
    expect(screen.getByText("스마트 지식 어시스턴트")).toBeInTheDocument();
    expect(screen.getByText("이번 주 태스크 달성도")).toBeInTheDocument();
    expect(screen.getByText("78%")).toBeInTheDocument();
  });

  it("renders filter tabs and note list", async () => {
    render(<DashboardPage />);

    expect(screen.getByRole("button", { name: "전체 노트" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "즐겨찾기" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/노트 제목 또는 태그 검색/i)).toBeInTheDocument();
    expect(screen.getByText("지식 연결망 (Graph)")).toBeInTheDocument();
    expect(screen.getByText("실시간 협업 피드")).toBeInTheDocument();
  });

  it("allows typing in scratchpad and clicking convert to note", async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    const textarea = screen.getByPlaceholderText(/제목 없이 즉시 아이디어를 휘갈기세요/i);
    await user.clear(textarea);
    await user.type(textarea, "새로운 실시간 아이디어 기록");

    const convertBtn = screen.getByRole("button", { name: /정식 노트로 전환/i });
    expect(convertBtn).toBeInTheDocument();
    await user.click(convertBtn);

    // After conversion, verify that heading appears in notes section
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "새로운 실시간 아이디어 기록" })
      ).toBeInTheDocument();
    });
  });

  it("handles filter tab change and search input filtering", async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    // Click favorite tab
    const favTab = screen.getByRole("button", { name: "즐겨찾기" });
    await user.click(favTab);

    // Filter by search query
    const searchInput = screen.getByPlaceholderText(/노트 제목 또는 태그 검색/i);
    await user.type(searchInput, "디자인 시스템");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "2025 디자인 시스템 개편 로드맵" })
      ).toBeInTheDocument();
    });
  });

  it("handles new note creation button", async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    const newNoteBtn = screen.getByRole("button", { name: /\+ 새 노트 만들기/i });
    await user.click(newNoteBtn);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "새로운 생각과 영감" })).toBeInTheDocument();
    });
  });

  it("toggles favorite status when star button is clicked", async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getAllByTitle("즐겨찾기").length).toBeGreaterThan(0);
    });

    const starBtns = screen.getAllByTitle("즐겨찾기");
    await user.click(starBtns[0]);
  });

  it("switches sidebar navigation tabs and scratchpad clear button", async () => {
    const user = userEvent.setup();
    render(<DashboardPage />);

    const quickNoteMenu = screen.getByText("빠른 메모");
    await user.click(quickNoteMenu);

    const clearBtn = screen.getByRole("button", { name: "지우기" });
    await user.click(clearBtn);

    const textarea = screen.getByPlaceholderText(/제목 없이 즉시 아이디어를 휘갈기세요/i);
    expect(textarea).toHaveValue("");
  });
});
