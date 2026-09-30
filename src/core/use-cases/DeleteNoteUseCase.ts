import { INoteRepository } from "../domain/INoteRepository";
import { ISubscriptionRepository } from "../domain/ISubscriptionRepository";
import { CheckNotePermissionUseCase } from "./CheckNotePermissionUseCase";

export class DeleteNoteUseCase {
  private checkPermissionUseCase: CheckNotePermissionUseCase;

  constructor(
    private noteRepository: INoteRepository,
    permissionSource: CheckNotePermissionUseCase | ISubscriptionRepository
  ) {
    if ("execute" in permissionSource && typeof permissionSource.execute === "function") {
      this.checkPermissionUseCase = permissionSource;
    } else {
      this.checkPermissionUseCase = new CheckNotePermissionUseCase(permissionSource as ISubscriptionRepository);
    }
  }

  async execute(id: string): Promise<boolean> {
    const permissions = await this.checkPermissionUseCase.execute();
    if (!permissions.canDelete) {
      throw new Error("결제가 완료된 회원만 노트를 삭제할 수 있습니다. 요금제를 업그레이드해 주세요.");
    }

    return await this.noteRepository.deleteNote(id);
  }
}
