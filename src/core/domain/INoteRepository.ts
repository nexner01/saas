import { Note, CreateNoteInput } from "./Note";

export interface INoteRepository {
  getNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | null>;
  createNote(input: CreateNoteInput): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note | null>;
  toggleFavorite(id: string, isFavorite: boolean): Promise<boolean>;
  deleteNote(id: string): Promise<boolean>;
}
