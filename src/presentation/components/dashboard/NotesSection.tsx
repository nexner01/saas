import React, { useState } from "react";
import Link from "next/link";
import { Note } from "@/src/core/domain/Note";
import { TagChip } from "../common/StatusBadge";

interface NotesSectionProps {
  notes: Note[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDeleteNote?: (id: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onToggleFavorite,
  onDeleteNote,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="flex flex-col gap-6">
      {/* Filter & View Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/30">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
          {["전체 노트", "즐겨찾기", "팀 공유", "보관함"].map((tab) => (
            <button
              key={tab}
              onClick={() => onFilterChange(tab)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Control Utilities */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 md:w-56">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="노트 제목 또는 태그 검색..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-container-low rounded-lg text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-outline-variant/20"
            />
          </div>

          {/* Sort Select */}
          <div className="relative">
            <button
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs transition-colors border border-outline-variant/20 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">sort</span>
              <span>최근 수정순</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>

          {/* Layout Switcher Toggles */}
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg text-on-surface-variant border border-outline-variant/20">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded cursor-pointer ${
                viewMode === "grid"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "hover:text-on-surface"
              }`}
              title="카드 그리드 뷰"
              type="button"
            >
              <span className="material-symbols-outlined text-lg leading-none">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1 rounded cursor-pointer ${
                viewMode === "list"
                  ? "bg-surface-container-lowest text-primary shadow-xs"
                  : "hover:text-on-surface"
              }`}
              title="리스트 뷰"
              type="button"
            >
              <span className="material-symbols-outlined text-lg leading-none">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid / List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 gap-5"
            : "flex flex-col gap-3"
        }
      >
        {notes.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant/30 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">description</span>
            <p className="text-sm font-medium">검색 조건에 맞는 노트가 없습니다.</p>
          </div>
        ) : (
          notes.map((note, index) => (
            <div
              key={note.id}
              className="group relative flex flex-col justify-between p-5 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all border border-outline-variant/30"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {note.tags.map((tag) => (
                      <TagChip
                        key={tag}
                        label={tag}
                        className="bg-primary-fixed text-primary font-mono text-[11px] font-semibold border-none py-0.5"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(note.id, note.is_favorite);
                      }}
                      className={`p-1 transition-colors cursor-pointer ${
                        note.is_favorite
                          ? "text-secondary hover:text-secondary-container"
                          : "text-on-surface-variant hover:text-secondary"
                      }`}
                      title="즐겨찾기"
                      type="button"
                    >
                      <span
                        className="material-symbols-outlined text-lg leading-none"
                        style={{
                          fontVariationSettings: note.is_favorite ? "'FILL' 1" : "'FILL' 0",
                        }}
                      >
                        star
                      </span>
                    </button>
                    {onDeleteNote && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                        className="p-1 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                        title="노트 삭제"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-lg leading-none">
                          delete
                        </span>
                      </button>
                    )}
                    <button
                      className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                      title="더보기"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg leading-none">
                        more_horiz
                      </span>
                    </button>
                  </div>
                </div>

                {/* Content preview with Link */}
                <Link href={`/notes/${note.id}`} className="flex flex-col gap-1.5 cursor-pointer">
                  <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                    {note.content}
                  </p>
                </Link>

                {/* Decorative Visual/Code snippet if first or second note */}
                {index === 0 && (
                  <div className="relative h-24 w-full rounded-lg overflow-hidden bg-gradient-to-tr from-primary/10 via-secondary/10 to-surface-container-high flex items-center justify-center p-3 border border-outline-variant/20">
                    <div className="flex items-center gap-2 text-primary text-xs font-mono">
                      <span className="material-symbols-outlined text-base">palette</span>
                      <span>Figma Tokens Auto-pipeline Active</span>
                    </div>
                  </div>
                )}
                {index === 1 && (
                  <div className="bg-surface-container-low p-2.5 rounded-lg font-mono text-[11px] text-on-surface-variant overflow-x-hidden border border-outline-variant/20">
                    <p className="text-primary font-semibold">// Client Sync Listener</p>
                    <p>const ydoc = new Y.Doc();</p>
                    <p className="text-tertiary">await noteflow.sync(ydoc);</p>
                  </div>
                )}
              </div>

              {/* Card Footer Metadata */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-[10px] flex items-center justify-center">
                    KN
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    {new Date(note.updated_at).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">timer</span>
                  <span>{note.reading_time}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
