import { Note } from "../domain/Note";
import { INoteRepository } from "../domain/INoteRepository";

export class UpdateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(id: string, updates: Partial<Note>): Promise<Note | null> {
    return this.noteRepository.updateNote(id, {
      ...updates,
      updated_at: new Date().toISOString(),
    });
  }
}
