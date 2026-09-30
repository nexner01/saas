import { Note, CreateNoteInput } from "@/src/core/domain/Note";
import { INoteRepository } from "@/src/core/domain/INoteRepository";
import { supabase } from "../database/supabaseClient";

// 기본 목업 시드 데이터 (DB 연결 실패 시 fallback 및 초기 시연 지원)
const defaultSeedNotes: Note[] = [
  {
    id: "note-1",
    title: "2025 디자인 시스템 개편 로드맵",
    content: "컴포넌트 라이브러리 간소화 및 토큰 자동 배포 파이프라인 수립안입니다. Figma 변수 기능과 연동하여 디자이너와 프론트엔드 개발자 간의 시각적 불일치를 제로화하는 것을 목표로 설정하였습니다.",
    tags: ["#기획", "#UX"],
    is_favorite: true,
    is_archived: false,
    reading_time: "4분 분량",
    category: "전체",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "note-2",
    title: "CRDT 기반 실시간 협업 엔진 아키텍처",
    content: "Yjs 알고리즘과 WebSocket 서버 클러스터링을 적용한 동시 편집 동기화 프로토콜 분석. 오프라인 우선(Offline-first) 데이터 영속성을 위한 IndexedDB 캐싱 구조 정리.",
    tags: ["#개발", "#아키텍처"],
    is_favorite: false,
    is_archived: false,
    reading_time: "7분 분량",
    category: "전체",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "note-3",
    title: "10월 1주차 전사 제품 싱크 회의록",
    content: "안건: 모바일 앱 런칭 QA 결과 보고 및 베타 테스터 500명 대상 피드백 우선순위화. 온보딩 이탈률 14% 개선을 위한 마이크로 인터랙션 개선 제안 승인 완료.",
    tags: ["#주간회의", "#스프린트"],
    is_favorite: true,
    is_archived: false,
    reading_time: "5분 분량",
    category: "팀 공유",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "note-4",
    title: "지식 노동자 심층 인터뷰 인사이트 (12인)",
    content: "사용자들이 기존 노트 도구에서 겪는 가장 큰 좌절감은 ‘정리되지 않은 폴더 구조’와 ‘작성 후 다시 찾지 않게 되는 분절성’이었습니다. 그래프 기반 역링크 탐색이 핵심 리텐션 요인으로 작동함을 발견했습니다.",
    tags: ["#리서치", "#사용자조사"],
    is_favorite: false,
    is_archived: false,
    reading_time: "12분 분량",
    category: "전체",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

let memoryNotes: Note[] = [...defaultSeedNotes];

export class SupabaseNoteRepository implements INoteRepository {
  static resetSeed(): void {
    memoryNotes = [...defaultSeedNotes];
  }

  async getNotes(): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return memoryNotes;
      }

      return data.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content || "",
        tags: item.tags || [],
        is_favorite: item.is_favorite ?? false,
        is_archived: item.is_archived ?? false,
        reading_time: item.reading_time || "3분 분량",
        category: item.category || "전체",
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    } catch {
      return memoryNotes;
    }
  }

  async getNoteById(id: string): Promise<Note | null> {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          content: data.content || "",
          tags: data.tags || [],
          is_favorite: data.is_favorite ?? false,
          is_archived: data.is_archived ?? false,
          reading_time: data.reading_time || "3분 분량",
          category: data.category || "전체",
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }
    } catch {
      // Fallback to local memory
    }

    return memoryNotes.find((n) => n.id === id) || memoryNotes[0] || null;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | null> {
    const index = memoryNotes.findIndex((n) => n.id === id);
    if (index !== -1) {
      memoryNotes[index] = {
        ...memoryNotes[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
    }

    try {
      const { data, error } = await supabase
        .from("notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          content: data.content || "",
          tags: data.tags || [],
          is_favorite: data.is_favorite ?? false,
          is_archived: data.is_archived ?? false,
          reading_time: data.reading_time || "3분 분량",
          category: data.category || "전체",
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
      }
    } catch {
      // Fallback
    }

    return index !== -1 ? memoryNotes[index] : null;
  }

  async createNote(input: CreateNoteInput): Promise<Note> {
    const newNote: Note = {
      id: "note-" + Date.now(),
      title: input.title,
      content: input.content,
      tags: input.tags || ["#메모"],
      is_favorite: input.is_favorite ?? false,
      is_archived: false,
      reading_time: input.reading_time || "3분 분량",
      category: input.category || "전체",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert({
          title: newNote.title,
          content: newNote.content,
          tags: newNote.tags,
          is_favorite: newNote.is_favorite,
          is_archived: newNote.is_archived,
          reading_time: newNote.reading_time,
          category: newNote.category,
        })
        .select()
        .single();

      if (!error && data) {
        const created: Note = {
          id: data.id,
          title: data.title,
          content: data.content || "",
          tags: data.tags || [],
          is_favorite: data.is_favorite ?? false,
          is_archived: data.is_archived ?? false,
          reading_time: data.reading_time || "3분 분량",
          category: data.category || "전체",
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        memoryNotes.unshift(created);
        return created;
      }
    } catch {
      // Fallback to local memory
    }

    memoryNotes.unshift(newNote);
    return newNote;
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<boolean> {
    const target = memoryNotes.find((n) => n.id === id);
    if (target) {
      target.is_favorite = isFavorite;
    }

    try {
      await supabase
        .from("notes")
        .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
        .eq("id", id);
    } catch {
      // Fallback
    }

    return isFavorite;
  }

  async deleteNote(id: string): Promise<boolean> {
    memoryNotes = memoryNotes.filter((n) => n.id !== id);
    try {
      await supabase.from("notes").delete().eq("id", id);
    } catch {
      // Fallback
    }
    return true;
  }
}
