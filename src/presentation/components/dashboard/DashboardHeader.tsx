import React from "react";

interface DashboardHeaderProps {
  onNewNoteClick?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onNewNoteClick }) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-8 border-b border-outline-variant/30">
      <div className="flex items-center gap-3">
        <button
          className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
          title="탐색기"
          type="button"
        >
          <span className="material-symbols-outlined leading-none text-xl">menu_open</span>
        </button>
        <span className="text-xs text-on-surface-variant font-mono">
          워크스페이스 &gt; 활성 세션
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-medium transition-colors border border-outline-variant/20 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base leading-none">history</span>
          <span>최근 변경</span>
        </button>
        <button
          onClick={onNewNoteClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-base leading-none">add</span>
          <span>새 메모</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center justify-center ml-2 ring-1 ring-outline-variant/40 shadow-xs">
          서연
        </div>
      </div>
    </header>
  );
};
