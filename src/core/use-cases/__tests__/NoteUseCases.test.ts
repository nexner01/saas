import { describe, it, expect, vi } from "vitest";
import { Note } from "@/src/core/domain/Note";
import { GetNotesUseCase } from "../GetNotesUseCase";
import { CreateNoteUseCase } from "../CreateNoteUseCase";
import { ToggleFavoriteUseCase } from "../ToggleFavoriteUseCase";
import { INoteRepository } from "@/src/core/domain/INoteRepository";

const mockNotes: Note[] = [
  {
    id: "1",
    title: "디자인 시스템 로드맵",
    content: "피그마 변수 연동",
    tags: ["#기획", "#UX"],
    is_favorite: true,
    is_archived: false,
    reading_time: "4분 분량",
    category: "전체",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "CRDT 실시간 협업",
    content: "Yjs 분산 알고리즘",
    tags: ["#개발"],
    is_favorite: false,
    is_archived: false,
    reading_time: "7분 분량",
    category: "전체",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

describe("Note Use Cases (TDD)", () => {
  it("GetNotesUseCase returns filtered and searched notes", async () => {
    const mockRepo: INoteRepository = {
      getNotes: vi.fn().mockResolvedValue(mockNotes),
      createNote: vi.fn(),
      toggleFavorite: vi.fn(),
      deleteNote: vi.fn(),
    };

    const getNotesUseCase = new GetNotesUseCase(mockRepo);
    const allNotes = await getNotesUseCase.execute();
    expect(allNotes).toHaveLength(2);

    const favoriteNotes = await getNotesUseCase.execute({ favoriteOnly: true });
    expect(favoriteNotes).toHaveLength(1);
    expect(favoriteNotes[0].title).toBe("디자인 시스템 로드맵");

    const searchResult = await getNotesUseCase.execute({ query: "CRDT" });
    expect(searchResult).toHaveLength(1);
    expect(searchResult[0].title).toBe("CRDT 실시간 협업");
  });

  it("CreateNoteUseCase creates a new note and returns it", async () => {
    const newNote: Note = {
      id: "3",
      title: "새 스크래치 메모",
      content: "오늘의 회의 내용",
      tags: ["#메모"],
      is_favorite: false,
      is_archived: false,
      reading_time: "2분 분량",
      category: "전체",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockRepo: INoteRepository = {
      getNotes: vi.fn().mockResolvedValue([]),
      createNote: vi.fn().mockResolvedValue(newNote),
      toggleFavorite: vi.fn(),
      deleteNote: vi.fn(),
    };

    const createNoteUseCase = new CreateNoteUseCase(mockRepo);
    const created = await createNoteUseCase.execute({
      title: "새 스크래치 메모",
      content: "오늘의 회의 내용",
    });

    expect(created.id).toBe("3");
    expect(created.title).toBe("새 스크래치 메모");
    expect(mockRepo.createNote).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "새 스크래치 메모",
        content: "오늘의 회의 내용",
      })
    );
  });

  it("ToggleFavoriteUseCase toggles is_favorite status", async () => {
    const mockRepo: INoteRepository = {
      getNotes: vi.fn(),
      createNote: vi.fn(),
      toggleFavorite: vi.fn().mockResolvedValue(true),
      deleteNote: vi.fn(),
    };

    const toggleFavoriteUseCase = new ToggleFavoriteUseCase(mockRepo);
    const result = await toggleFavoriteUseCase.execute("1", false);

    expect(result).toBe(true);
    expect(mockRepo.toggleFavorite).toHaveBeenCalledWith("1", true);
  });
});
