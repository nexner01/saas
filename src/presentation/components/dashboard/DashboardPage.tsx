"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Note } from "@/src/core/domain/Note";
import { SupabaseNoteRepository } from "@/src/infrastructure/repositories/SupabaseNoteRepository";
import { GetNotesUseCase } from "@/src/core/use-cases/GetNotesUseCase";
import { CreateNoteUseCase } from "@/src/core/use-cases/CreateNoteUseCase";
import { ToggleFavoriteUseCase } from "@/src/core/use-cases/ToggleFavoriteUseCase";
import { AppLayout } from "../layout/AppLayout";
import { WelcomeSection } from "./WelcomeSection";
import { DashboardBentoWidgets } from "./DashboardBentoWidgets";
import { NotesSection } from "./NotesSection";
import { UtilityDrawer } from "./UtilityDrawer";

export const DashboardPage: React.FC = () => {
  const repository = useMemo(() => new SupabaseNoteRepository(), []);
  const getNotesUseCase = useMemo(() => new GetNotesUseCase(repository), [repository]);
  const createNoteUseCase = useMemo(() => new CreateNoteUseCase(repository), [repository]);
  const toggleFavoriteUseCase = useMemo(() => new ToggleFavoriteUseCase(repository), [repository]);

  const [notes, setNotes] = useState<Note[]>([]);
  const [activeFilter, setActiveFilter] = useState("전체 노트");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Load initial notes from Supabase repository
  useEffect(() => {
    let mounted = true;
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const fetched = await getNotesUseCase.execute();
        if (mounted) {
          setNotes(fetched);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchNotes();
    return () => {
      mounted = false;
    };
  }, [getNotesUseCase]);

  // Handle scratchpad conversion to note
  const handleConvertToNote = async (content: string) => {
    const lines = content.split("\n").filter((l) => l.trim().length > 0);
    const title = lines[0]?.replace(/^[#\s\-*]+/, "").slice(0, 30) || "새 스크래치 메모";
    const newNote = await createNoteUseCase.execute({
      title,
      content,
      tags: ["#스크래치", "#아이디어"],
    });

    setNotes((prev) => [newNote, ...prev]);
  };

  // Handle + New Note creation
  const handleCreateNewNote = async () => {
    const newNote = await createNoteUseCase.execute({
      title: "새로운 생각과 영감",
      content: "자유롭게 생각을 기록하고 지식 네트워크로 연결해 보세요.",
      tags: ["#새메모"],
    });

    setNotes((prev) => [newNote, ...prev]);
  };

  // Handle favorite toggle
  const handleToggleFavorite = async (id: string, current: boolean) => {
    // Optimistic UI update
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_favorite: !current } : n))
    );
    await toggleFavoriteUseCase.execute(id, current);
  };

  // Filtered notes calculation
  const displayedNotes = useMemo(() => {
    return notes.filter((n) => {
      if (activeFilter === "즐겨찾기" && !n.is_favorite) return false;
      if (activeFilter === "팀 공유" && n.category !== "팀 공유") return false;
      if (activeFilter === "보관함" && !n.is_archived) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesContent = n.content.toLowerCase().includes(q);
        const matchesTags = n.tags.some((t) => t.toLowerCase().includes(q));
        return matchesTitle || matchesContent || matchesTags;
      }

      return true;
    });
  }, [notes, activeFilter, searchQuery]);

  const favoriteCount = useMemo(() => {
    return notes.filter((n) => n.is_favorite).length;
  }, [notes]);

  return (
    <AppLayout currentTab="dashboard" onNewNoteClick={handleCreateNewNote}>
      <div className="flex flex-col w-full px-8 py-8 gap-8 max-w-[1600px] mx-auto">
        {/* Top Welcome & Metrics Section */}
        <WelcomeSection
          totalNotes={notes.length}
          favoriteNotesCount={favoriteCount}
          onNewNoteClick={handleCreateNewNote}
          onAiBriefClick={() => alert("Noteflow AI가 최근 노트를 분석하고 있습니다.")}
        />

        {/* Pinned 3 Bento Widgets */}
        <DashboardBentoWidgets
          onConvertToNote={handleConvertToNote}
          onOpenNote={() => alert("노트 열기")}
        />

        {/* Two Column Layout: Main Notes + Right Utility Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Notes Grid (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <NotesSection
              notes={displayedNotes}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {/* Right Utility Drawer (4 cols) */}
          <div className="lg:col-span-4">
            <UtilityDrawer />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
