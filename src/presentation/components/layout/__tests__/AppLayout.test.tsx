import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AppLayout } from "../AppLayout";

describe("AppLayout Component (TDD)", () => {
  it("renders sidebar with brand logo, workspace, and navigation links", () => {
    render(
      <AppLayout>
        <div data-testid="test-content">콘텐츠 영역</div>
      </AppLayout>
    );

    // 브랜드 로고 및 워크스페이스
    expect(screen.getAllByText("Noteflow").length).toBeGreaterThan(0);
    expect(screen.getByText("개인 워크스페이스")).toBeInTheDocument();

    // 사이드바 내비게이션 링크 확인
    expect(screen.getByRole("link", { name: /대시보드/i })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: /노트 관리/i })).toHaveAttribute("href", "/notes");

    // Children 렌더링 확인
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });

  it("calls onNewNoteClick when header new note button is clicked", async () => {
    const user = userEvent.setup();
    const handleNewNote = vi.fn();

    render(
      <AppLayout onNewNoteClick={handleNewNote}>
        <div>내용</div>
      </AppLayout>
    );

    const newNoteBtn = screen.getByRole("button", { name: /새 메모/i });
    await user.click(newNoteBtn);

    expect(handleNewNote).toHaveBeenCalledTimes(1);
  });
});
