import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotesManagementPage } from "../NotesManagementPage";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";

describe("NotesManagementPage Component (TDD)", () => {
  beforeEach(async () => {
    const repo = new SubscriptionRepository();
    await repo.activatePlan("PRO");
  });
  it("renders page header, search input, and note cards", async () => {
    render(<NotesManagementPage />);

    // 페이지 제목 (h1)
    expect(screen.getByRole("heading", { name: "노트 관리", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("모든 문서와 지식 베이스를 체계적으로 관리하세요.")).toBeInTheDocument();

    // 초기 노트 렌더링 확인 (비동기 로드)
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "2025 디자인 시스템 개편 로드맵" })).toBeInTheDocument();
    });
  });

  it("filters notes when typing in the search box", async () => {
    const user = userEvent.setup();
    render(<NotesManagementPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "2025 디자인 시스템 개편 로드맵" })).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/노트 제목 또는 태그 검색/i);
    await user.type(searchInput, "CRDT");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "CRDT 기반 실시간 협업 엔진 아키텍처" })).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "2025 디자인 시스템 개편 로드맵" })).not.toBeInTheDocument();
    });
  });

  it("creates a new note when clicking create button", async () => {
    const user = userEvent.setup();
    render(<NotesManagementPage />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "2025 디자인 시스템 개편 로드맵" })).toBeInTheDocument();
    });

    const createBtn = screen.getByRole("button", { name: /새 노트 작성/i });
    await user.click(createBtn);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "새로운 생각과 영감" })).toBeInTheDocument();
    });
  });
});
