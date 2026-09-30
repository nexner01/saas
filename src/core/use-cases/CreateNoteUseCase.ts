import { Note, CreateNoteInput } from "../domain/Note";
import { INoteRepository } from "../domain/INoteRepository";

export class CreateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(input: CreateNoteInput): Promise<Note> {
    const trimmedTitle = input.title.trim() || "제목 없는 노트";
    return this.noteRepository.createNote({
      ...input,
      title: trimmedTitle,
      tags: input.tags || ["#메모"],
      category: input.category || "전체",
      reading_time: input.reading_time || "3분 분량",
    });
  }
}
