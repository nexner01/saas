import React from "react";

interface WelcomeSectionProps {
  totalNotes: number;
  favoriteNotesCount: number;
  onNewNoteClick?: () => void;
  onAiBriefClick?: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  totalNotes,
  favoriteNotesCount,
  onNewNoteClick,
  onAiBriefClick,
}) => {
  return (
    <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-surface-container-lowest p-7 rounded-xl shadow-sm border border-outline-variant/30">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            좋은 하루입니다, 서연님 👋
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-tertiary-fixed text-on-tertiary-fixed font-semibold">
            Pro 플랜 활성
          </span>
        </div>
        <p className="text-sm text-on-surface-variant">
          오늘도 정리되지 않은 생각들을 연결하고 명확한 실행 계획으로 전환해보세요.
        </p>

        {/* Metrics row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/20">
            <span className="material-symbols-outlined text-base text-primary">description</span>
            <span className="text-xs text-on-surface-variant">전체 노트</span>
            <span className="text-xs font-bold text-on-surface">{totalNotes}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/20">
            <span
              className="material-symbols-outlined text-base text-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="text-xs text-on-surface-variant">즐겨찾기</span>
            <span className="text-xs font-bold text-on-surface">{favoriteNotesCount}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant/20">
            <span className="material-symbols-outlined text-base text-tertiary">group_work</span>
            <span className="text-xs text-on-surface-variant">공유 워크스페이스</span>
            <span className="text-xs font-bold text-on-surface">6</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed border border-primary/20">
            <span className="material-symbols-outlined text-base">trending_up</span>
            <span className="text-xs">이번 주 새 메모</span>
            <span className="text-xs font-bold text-primary">+18개</span>
          </div>
        </div>
      </div>

      {/* Primary Quick Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onAiBriefClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition-all active:scale-[0.98] border border-outline-variant/20 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-lg leading-none">auto_awesome</span>
          <span>AI 요약 브리프</span>
        </button>
        <button
          onClick={onNewNoteClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-lg leading-none">add</span>
          <span>+ 새 노트 만들기</span>
          <kbd className="font-mono text-[11px] bg-primary-container/40 text-on-primary px-1.5 py-0.5 rounded ml-1">
            ⌘N
          </kbd>
        </button>
      </div>
    </section>
  );
};
