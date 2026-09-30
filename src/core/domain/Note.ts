export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  is_archived: boolean;
  reading_time: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export type CreateNoteInput = {
  title: string;
  content: string;
  tags?: string[];
  is_favorite?: boolean;
  category?: string;
  reading_time?: string;
};
