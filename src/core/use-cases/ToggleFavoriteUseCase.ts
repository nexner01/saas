import { INoteRepository } from "../domain/INoteRepository";

export class ToggleFavoriteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(id: string, currentStatus: boolean): Promise<boolean> {
    const nextStatus = !currentStatus;
    return this.noteRepository.toggleFavorite(id, nextStatus);
  }
}
