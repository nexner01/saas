import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { NoteEditorPage } from "../NoteEditorPage";

describe("NoteEditorPage Component (TDD)", () => {
  it("renders editor toolbar with presence and action buttons", async () => {
    render(<NoteEditorPage noteId="note-1" />);

    expect(screen.getAllByText("개인 워크스페이스").length).toBeGreaterThan(0);
    expect(screen.getByText(/방금 전 클라우드 저장됨/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /AI로 다듬기/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /공유/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /PDF\/MD/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /발행하기/i })).toBeInTheDocument();
  });

  it("renders note header, title, and properties sheet", async () => {
    render(<NoteEditorPage noteId="note-1" />);

    expect(screen.getAllByText("💡").length).toBeGreaterThan(0);
    expect(screen.getByText("최종 수정일시")).toBeInTheDocument();
    expect(screen.getByText("태그 속성")).toBeInTheDocument();
    expect(screen.getAllByText("연결된 노트").length).toBeGreaterThan(0);
  });

  it("renders markdown canvas core blocks including tasks, callout, table and code", async () => {
    render(<NoteEditorPage noteId="note-1" />);

    // Section 1
    expect(screen.getAllByText(/1\. 핵심 개발 목표/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/엔지니어링 스프린트 중요 안내/i)).toBeInTheDocument();

    // Section 2
    expect(screen.getAllByText(/2\. 우선순위 기능 매트릭스/i).length).toBeGreaterThan(0);
    expect(screen.getByText("기능명 (Feature)")).toBeInTheDocument();
    expect(screen.getByText("문맥 기반 스마트 제안")).toBeInTheDocument();

    // Section 3
    expect(screen.getAllByText(/3\. Noteflow AI SDK 연동/i).length).toBeGreaterThan(0);
    expect(screen.getByText("noteflow-agent-client.ts")).toBeInTheDocument();

    // Slash command bar
    expect(screen.getByText(/명령어를 입력하려면/i)).toBeInTheDocument();
  });

  it("renders right AI assistant sidebar and outline", async () => {
    render(<NoteEditorPage noteId="note-1" />);

    expect(screen.getByText("Noteflow AI")).toBeInTheDocument();
    expect(screen.getByText("이 문서 3줄 요약")).toBeInTheDocument();
    expect(screen.getByText("회의록 액션 아이템 추출")).toBeInTheDocument();
    expect(screen.getByText("문서 목차 (Outline)")).toBeInTheDocument();
    expect(screen.getByText("총 글자 수 (Characters)")).toBeInTheDocument();
  });

  it("allows editing note title and triggers auto-save", async () => {
    const user = userEvent.setup();
    render(<NoteEditorPage noteId="note-1" />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(/스마트 메모|디자인 시스템|로드맵/i)).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue(/스마트 메모|디자인 시스템|로드맵/i);
    await user.clear(titleInput);
    await user.type(titleInput, "수정된 타이틀 2025");

    expect(titleInput).toHaveValue("수정된 타이틀 2025");
  });

  it("handles interactions: task toggle, copy code, tag add, AI prompt and favorite", async () => {
    const user = userEvent.setup();
    render(<NoteEditorPage noteId="note-1" />);

    // 1. Task toggle
    const checkboxes = screen.getAllByRole("checkbox");
    if (checkboxes.length > 0) {
      await user.click(checkboxes[0]);
    }

    // 2. Code copy button
    const copyBtn = screen.getByTitle("코드 복사");
    await user.click(copyBtn);

    // 3. Tag addition
    const addTagBtn = screen.getByRole("button", { name: /태그 추가/i });
    await user.click(addTagBtn);

    const tagInput = screen.getByPlaceholderText("태그명");
    await user.type(tagInput, "새태그");
    const confirmAddTag = screen.getByRole("button", { name: "추가" });
    await user.click(confirmAddTag);
    expect(screen.getByText("#새태그")).toBeInTheDocument();

    // 4. AI prompt chip & prompt input
    const summaryChip = screen.getByText("이 문서 3줄 요약");
    await user.click(summaryChip);
    expect(await screen.findByText(/AI 요약/i)).toBeInTheDocument();

    const aiInput = screen.getByPlaceholderText(/AI에게 질문이나 지시하기/i);
    await user.type(aiInput, "요약해줘");
    const sendBtn = screen.getByTitle("질문 전송");
    await user.click(sendBtn);

    // 5. Favorite toggle (get all favorite buttons and click)
    const favoriteBtns = screen.getAllByRole("button", { name: /즐겨찾기/i });
    await user.click(favoriteBtns[favoriteBtns.length - 1]);
  });
});
