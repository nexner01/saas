import { Note } from "../domain/Note";
import { INoteRepository } from "../domain/INoteRepository";

export interface GetNotesFilter {
  favoriteOnly?: boolean;
  query?: string;
  category?: string;
}

export class GetNotesUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(filter?: GetNotesFilter): Promise<Note[]> {
    const notes = await this.noteRepository.getNotes();

    return notes.filter((note) => {
      if (filter?.favoriteOnly && !note.is_favorite) {
        return false;
      }
      if (filter?.category && filter.category !== "전체" && note.category !== filter.category) {
        return false;
      }
      if (filter?.query) {
        const q = filter.query.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(q);
        const matchesContent = note.content.toLowerCase().includes(q);
        const matchesTags = note.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }
}
