import { Note } from "../domain/Note";
import { INoteRepository } from "../domain/INoteRepository";

export class GetNoteByIdUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(id: string): Promise<Note | null> {
    return this.noteRepository.getNoteById(id);
  }
}
