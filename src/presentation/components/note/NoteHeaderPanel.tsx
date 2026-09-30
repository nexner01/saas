import React, { useState } from "react";
import Link from "next/link";
import { Note } from "@/src/core/domain/Note";
import { TagChip } from "../common/StatusBadge";

interface NoteHeaderPanelProps {
  note: Note;
  onTitleChange: (newTitle: string) => void;
  onToggleFavorite: () => void;
}

export const NoteHeaderPanel: React.FC<NoteHeaderPanelProps> = ({
  note,
  onTitleChange,
  onToggleFavorite,
}) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [localTags, setLocalTags] = useState(note.tags);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const formatted = tagInput.startsWith("#") ? tagInput.trim() : `#${tagInput.trim()}`;
      setLocalTags([...localTags, formatted]);
      setTagInput("");
      setIsAddingTag(false);
    }
  };

  return (
    <header className="flex flex-col gap-4 mb-8">
      {/* Cover Art Banner (Interactive Minimal) */}
      <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6 group bg-gradient-to-r from-primary/10 via-secondary/15 to-surface-container-high shadow-xs border border-outline-variant/30 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl select-none">💡</span>
          <p className="text-xs text-on-surface-variant font-medium mt-2">지식 워크스페이스 문서 캔버스</p>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="px-2.5 py-1 rounded-lg bg-surface/90 backdrop-blur-md text-on-surface text-xs hover:bg-surface transition-all flex items-center gap-1 shadow-xs cursor-pointer">
            <span className="material-symbols-outlined text-sm leading-none">photo_camera</span>
            커버 변경
          </button>
          <button className="px-2 py-1 rounded-lg bg-surface/90 backdrop-blur-md text-on-surface-variant hover:text-error text-xs hover:bg-surface transition-all cursor-pointer">
            <span className="material-symbols-outlined text-sm leading-none">delete</span>
          </button>
        </div>
      </div>

      {/* Page Icon & Meta Control */}
      <div className="flex items-center justify-between -mt-12 mb-1 px-2">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-lowest shadow-md flex items-center justify-center text-3xl cursor-pointer hover:rotate-6 transition-transform select-none group relative border border-outline-variant/30">
          <span>💡</span>
          <div className="absolute inset-0 rounded-2xl bg-on-surface/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="material-symbols-outlined text-xs text-on-surface-variant">edit</span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-8">
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs transition-colors cursor-pointer border border-outline-variant/20">
            <span className="material-symbols-outlined text-sm leading-none">lock</span>
            잠금 해제됨
          </button>
          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border border-outline-variant/20 ${
              note.is_favorite ? "text-secondary font-semibold" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span
              className="material-symbols-outlined text-sm leading-none"
              style={{ fontVariationSettings: note.is_favorite ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            즐겨찾기
          </button>
        </div>
      </div>

      {/* Document Title Editable Input */}
      <div className="px-2">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="제목 없는 노트"
          className="w-full text-2xl sm:text-3xl font-extrabold text-on-surface outline-none focus:ring-0 tracking-tight leading-tight bg-transparent border-b border-transparent hover:border-outline-variant/40 focus:border-primary transition-all pb-1"
        />
      </div>

      {/* Structured Metadata Sheet */}
      <div className="flex flex-col gap-2.5 px-3 py-3.5 rounded-xl bg-surface-container-low shadow-xs border border-outline-variant/20">
        {/* Row 1: Timestamps */}
        <div className="flex items-center text-on-surface-variant text-xs">
          <div className="w-32 flex items-center gap-1.5 shrink-0 text-outline">
            <span className="material-symbols-outlined text-sm leading-none">schedule</span>
            <span>최종 수정일시</span>
          </div>
          <span className="font-mono text-on-surface font-medium">
            {new Date(note.updated_at).toLocaleString("ko-KR")}
          </span>
        </div>

        {/* Row 2: Dynamic Tags */}
        <div className="flex items-center text-on-surface-variant text-xs">
          <div className="w-32 flex items-center gap-1.5 shrink-0 text-outline">
            <span className="material-symbols-outlined text-sm leading-none">label</span>
            <span>태그 속성</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {localTags.map((tag) => (
              <TagChip
                key={tag}
                label={tag}
                className="bg-primary-fixed text-primary font-semibold border-none"
              />
            ))}
            {isAddingTag ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="태그명"
                  className="px-2 py-0.5 rounded text-xs bg-surface-container-lowest text-on-surface border border-outline-variant/40 outline-none w-20"
                />
                <button
                  onClick={handleAddTag}
                  className="px-2 py-0.5 rounded bg-primary text-white text-xs"
                >
                  추가
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingTag(true)}
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors text-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs leading-none">add</span>
                <span>태그 추가</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Backlinks & References */}
        <div className="flex items-center text-on-surface-variant text-xs">
          <div className="w-32 flex items-center gap-1.5 shrink-0 text-outline">
            <span className="material-symbols-outlined text-sm leading-none">link</span>
            <span>연결된 노트</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-lowest hover:bg-surface-container-high text-primary text-xs shadow-xs transition-colors border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-xs leading-none">description</span>
              <span>2025 Q1 사용자 인터뷰 분석</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-lowest hover:bg-surface-container-high text-primary text-xs shadow-xs transition-colors border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-xs leading-none">insights</span>
              <span>경쟁사 기능 벤치마킹 보고서</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
