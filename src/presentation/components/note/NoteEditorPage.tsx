"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Note } from "@/src/core/domain/Note";
import { SupabaseNoteRepository } from "@/src/infrastructure/repositories/SupabaseNoteRepository";
import { GetNoteByIdUseCase } from "@/src/core/use-cases/GetNoteByIdUseCase";
import { UpdateNoteUseCase } from "@/src/core/use-cases/UpdateNoteUseCase";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { NoteEditorToolbar } from "./NoteEditorToolbar";
import { NoteHeaderPanel } from "./NoteHeaderPanel";
import { MarkdownEditorCanvas } from "./MarkdownEditorCanvas";
import { NoteAssistantSidebar } from "./NoteAssistantSidebar";

interface NoteEditorPageProps {
  noteId: string;
}

export const NoteEditorPage: React.FC<NoteEditorPageProps> = ({ noteId }) => {
  const repository = useMemo(() => new SupabaseNoteRepository(), []);
  const getNoteByIdUseCase = useMemo(() => new GetNoteByIdUseCase(repository), [repository]);
  const updateNoteUseCase = useMemo(() => new UpdateNoteUseCase(repository), [repository]);

  const [note, setNote] = useState<Note>({
    id: noteId,
    title: "2025년 상반기 AI 기반 스마트 메모 기능 로드맵",
    content: "비정형 텍스트와 회의록을 자율 분석하여 지능형 지식 그래프로 연결하는 계획안입니다.",
    tags: ["#제품기획", "#AI어시스턴트", "#우선순위-높음"],
    is_favorite: true,
    is_archived: false,
    reading_time: "4분 분량",
    category: "전체",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  useEffect(() => {
    let mounted = true;
    const fetchNote = async () => {
      const fetched = await getNoteByIdUseCase.execute(noteId);
      if (fetched && mounted) {
        setNote(fetched);
      }
    };
    fetchNote();
    return () => {
      mounted = false;
    };
  }, [noteId, getNoteByIdUseCase]);

  const handleTitleChange = async (newTitle: string) => {
    setNote((prev) => ({ ...prev, title: newTitle }));
    await updateNoteUseCase.execute(note.id, { title: newTitle });
  };

  const handleToggleFavorite = async () => {
    const updatedStatus = !note.is_favorite;
    setNote((prev) => ({ ...prev, is_favorite: updatedStatus }));
    await updateNoteUseCase.execute(note.id, { is_favorite: updatedStatus });
  };

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen">
      {/* 1. Global Left Sidebar */}
      <DashboardSidebar currentTab="project-notes" />

      {/* 2. Main Page Area */}
      <div className="pl-64">
        {/* Global Header */}
        <DashboardHeader />

        {/* Editor Main Surface */}
        <main className="relative pt-16 bg-surface min-h-screen">
          <div className="flex flex-col w-full">
            {/* Ambient Glow behind canvas */}
            <div className="relative w-full overflow-hidden">
              <div className="absolute -top-32 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute top-64 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Editorial Top Utility & Collaborative Presence Bar */}
              <NoteEditorToolbar
                noteTitle={note.title}
                onAiRefine={() => alert("Noteflow AI가 문서 전체의 어조와 문법을 정제합니다.")}
                onShare={() => alert("문서 공유 링크가 복사되었습니다.")}
                onExport={() => alert("PDF / Markdown 내보내기 준비 중입니다.")}
                onPublish={() => alert("웹에 공개 발행되었습니다.")}
              />

              {/* Dual Canvas Layout: Document Center + Right AI Sidebar */}
              <div className="flex flex-row w-full justify-center px-4 lg:px-8 py-6 gap-8">
                {/* Primary Document Canvas Center */}
                <article className="flex-1 max-w-[840px] w-full min-w-0 transition-all flex flex-col">
                  {/* Note Header & Properties Panel */}
                  <NoteHeaderPanel
                    note={note}
                    onTitleChange={handleTitleChange}
                    onToggleFavorite={handleToggleFavorite}
                  />

                  {/* Markdown Canvas Core */}
                  <MarkdownEditorCanvas />
                </article>

                {/* Right Collapsible Assistant Sidebar (AI & Outline) */}
                <NoteAssistantSidebar />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
