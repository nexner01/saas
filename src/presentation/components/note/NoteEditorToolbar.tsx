import React from "react";
import Link from "next/link";
import { UserAvatar } from "../common/UserAvatar";
import { CloudSyncIndicator } from "../common/CloudSyncIndicator";

interface NoteEditorToolbarProps {
  noteTitle: string;
  onAiRefine?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  onPublish?: () => void;
}

export const NoteEditorToolbar: React.FC<NoteEditorToolbarProps> = ({
  noteTitle,
  onAiRefine,
  onShare,
  onExport,
  onPublish,
}) => {
  return (
    <section className="sticky top-0 z-30 w-full px-8 py-3 bg-surface/90 backdrop-blur-xl shadow-sm flex items-center justify-between transition-all border-b border-outline-variant/30">
      {/* Breadcrumb & Auto-save Status */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-on-surface-variant text-xs overflow-hidden text-ellipsis whitespace-nowrap">
          <Link href="/dashboard" className="hover:text-primary cursor-pointer transition-colors">
            개인 워크스페이스
          </Link>
          <span className="material-symbols-outlined text-xs text-outline leading-none">chevron_right</span>
          <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
            <span className="material-symbols-outlined text-sm leading-none text-secondary">folder</span>
            2025 제품 기획
          </span>
          <span className="material-symbols-outlined text-xs text-outline leading-none">chevron_right</span>
          <span className="font-semibold text-on-surface truncate max-w-[200px] sm:max-w-xs">{noteTitle}</span>
        </div>
        <div className="hidden md:flex items-center ml-2">
          <CloudSyncIndicator status="synced" text="방금 전 클라우드 저장됨 (Cloud Synced)" />
        </div>
      </div>

      {/* Action Group & Collaborators */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Live Presence Avatars */}
        <div className="flex items-center -space-x-2 mr-2">
          <div title="이수민 (동시 편집 중)">
            <UserAvatar name="이수민" size="sm" isLive={true} />
          </div>
          <div title="박준형 (열람 중)">
            <UserAvatar name="박준형" size="sm" />
          </div>
          <UserAvatar count={3} size="sm" />
        </div>

        {/* AI Assistant Action Button */}
        <button
          onClick={onAiRefine}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary text-xs font-semibold transition-all hover:shadow-xs active:scale-95 border border-outline-variant/20 cursor-pointer"
          id="aiTriggerBtn"
        >
          <span className="material-symbols-outlined text-base text-primary leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span>AI로 다듬기</span>
        </button>

        {/* Share & Export */}
        <div className="flex items-center bg-surface-container-low rounded-lg p-0.5 border border-outline-variant/20">
          <button
            onClick={onShare}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-surface text-xs transition-all cursor-pointer"
            title="공유 설정"
          >
            <span className="material-symbols-outlined text-base leading-none">ios_share</span>
            <span className="hidden sm:inline">공유</span>
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-surface text-xs transition-all cursor-pointer"
            title="내보내기"
          >
            <span className="material-symbols-outlined text-base leading-none">file_download</span>
            <span className="hidden sm:inline">PDF/MD</span>
          </button>
        </div>

        <button
          className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
          title="세부 옵션"
        >
          <span className="material-symbols-outlined text-lg leading-none">more_horiz</span>
        </button>

        <button
          onClick={onPublish}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <span>발행하기</span>
          <span className="material-symbols-outlined text-xs leading-none">north_east</span>
        </button>
      </div>
    </section>
  );
};
