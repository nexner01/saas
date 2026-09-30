"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Note } from "@/src/core/domain/Note";
import { SupabaseNoteRepository } from "@/src/infrastructure/repositories/SupabaseNoteRepository";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";
import { GetNotesUseCase } from "@/src/core/use-cases/GetNotesUseCase";
import { CreateNoteUseCase } from "@/src/core/use-cases/CreateNoteUseCase";
import { ToggleFavoriteUseCase } from "@/src/core/use-cases/ToggleFavoriteUseCase";
import { DeleteNoteUseCase } from "@/src/core/use-cases/DeleteNoteUseCase";
import { useSubscription } from "@/src/presentation/hooks/useSubscription";
import { AppLayout } from "../layout/AppLayout";
import { NotesSection } from "../dashboard/NotesSection";
import { StatusBadge } from "../common/StatusBadge";

export const NotesManagementPage: React.FC = () => {
  const router = useRouter();
  const { subscription, permissions } = useSubscription();

  const noteRepository = useMemo(() => new SupabaseNoteRepository(), []);
  const subscriptionRepository = useMemo(() => new SubscriptionRepository(), []);
  const getNotesUseCase = useMemo(() => new GetNotesUseCase(noteRepository), [noteRepository]);
  const createNoteUseCase = useMemo(() => new CreateNoteUseCase(noteRepository), [noteRepository]);
  const toggleFavoriteUseCase = useMemo(() => new ToggleFavoriteUseCase(noteRepository), [noteRepository]);
  const deleteNoteUseCase = useMemo(
    () => new DeleteNoteUseCase(noteRepository, subscriptionRepository),
    [noteRepository, subscriptionRepository]
  );

  const [notes, setNotes] = useState<Note[]>([]);
  const [activeFilter, setActiveFilter] = useState("전체 노트");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // 초기 노트 목록 로드
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

  // 새 노트 작성 핸들러 (권한 체크)
  const handleCreateNewNote = async () => {
    if (!permissions.canCreate) {
      router.push("/payment");
      return;
    }

    const newNote = await createNoteUseCase.execute({
      title: "새로운 생각과 영감",
      content: "자유롭게 생각을 기록하고 지식 네트워크로 연결해 보세요.",
      tags: ["#새메모"],
    });

    setNotes((prev) => [newNote, ...prev]);
  };

  // 노트 삭제 핸들러 (권한 체크 및 DeleteNoteUseCase 실행)
  const handleDeleteNote = async (id: string) => {
    if (!permissions.canDelete) {
      router.push("/payment");
      return;
    }

    setNotes((prev) => prev.filter((n) => n.id !== id));
    await deleteNoteUseCase.execute(id);
  };

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = async (id: string, current: boolean) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_favorite: !current } : n))
    );
    await toggleFavoriteUseCase.execute(id, current);
  };

  // 검색 및 필터링된 노트
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
    <AppLayout currentTab="notes" onNewNoteClick={handleCreateNewNote}>
      <div className="flex flex-col w-full px-8 py-8 gap-8 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                노트 관리
              </h1>
              <StatusBadge variant="primary">워크스페이스</StatusBadge>
              {permissions.isSubscribed && (
                <StatusBadge variant="tertiary">Pro 멤버십 활성</StatusBadge>
              )}
            </div>
            <p className="text-sm text-on-surface-variant">
              모든 문서와 지식 베이스를 체계적으로 관리하세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreateNewNote}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base leading-none">add</span>
              <span>새 노트 작성</span>
            </button>
          </div>
        </div>

        {/* 미결제 상태 안내 배너 */}
        {!permissions.isSubscribed && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">
                  결제 후 모든 노트를 자유롭게 생성, 수정, 삭제하세요
                </h4>
                <p className="text-xs text-on-surface-variant">
                  현재 체험 모드입니다. 토스페이먼츠 간편 결제로 Pro 멤버십을 활성화하고 모든 지식 관리 기능을 언락하세요.
                </p>
              </div>
            </div>
            <Link
              href="/payment"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-all shadow-sm shrink-0"
            >
              지금 플랜 결제하기
            </Link>
          </div>
        )}

        {/* Notes Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col gap-1">
            <span className="text-xs text-on-surface-variant font-medium">전체 노트</span>
            <span className="text-2xl font-black text-on-surface font-mono">{notes.length}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col gap-1">
            <span className="text-xs text-on-surface-variant font-medium">즐겨찾기</span>
            <span className="text-2xl font-black text-secondary font-mono">{favoriteCount}</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col gap-1">
            <span className="text-xs text-on-surface-variant font-medium">실시간 동기화</span>
            <span className="text-2xl font-black text-emerald-500 font-mono">100%</span>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 shadow-xs flex flex-col gap-1">
            <span className="text-xs text-on-surface-variant font-medium">AI 인덱싱</span>
            <span className="text-2xl font-black text-primary font-mono">활성</span>
          </div>
        </div>

        {/* Main Notes Section */}
        <div className="flex flex-col gap-6">
          <NotesSection
            notes={displayedNotes}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleFavorite={handleToggleFavorite}
            onDeleteNote={permissions.canDelete ? handleDeleteNote : undefined}
          />
        </div>
      </div>
    </AppLayout>
  );
};
