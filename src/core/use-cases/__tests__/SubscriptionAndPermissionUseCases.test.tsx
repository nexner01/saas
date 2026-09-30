import { describe, it, expect, beforeEach } from "vitest";
import { CheckNotePermissionUseCase } from "../CheckNotePermissionUseCase";
import { DeleteNoteUseCase } from "../DeleteNoteUseCase";
import { SupabaseNoteRepository } from "@/src/infrastructure/repositories/SupabaseNoteRepository";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";

describe("Subscription & Note Permission UseCases (TDD)", () => {
  let noteRepository: SupabaseNoteRepository;
  let subscriptionRepository: SubscriptionRepository;
  let checkPermissionUseCase: CheckNotePermissionUseCase;
  let deleteNoteUseCase: DeleteNoteUseCase;

  beforeEach(() => {
    noteRepository = new SupabaseNoteRepository();
    subscriptionRepository = new SubscriptionRepository();
    subscriptionRepository.reset(); // 기본 상태: 미결제 (FREE)
    checkPermissionUseCase = new CheckNotePermissionUseCase(subscriptionRepository);
    deleteNoteUseCase = new DeleteNoteUseCase(noteRepository, checkPermissionUseCase);
  });

  it("denies note CRUD permissions when user is not subscribed (FREE)", async () => {
    const permission = await checkPermissionUseCase.execute();
    expect(permission.canCreate).toBe(false);
    expect(permission.canUpdate).toBe(false);
    expect(permission.canDelete).toBe(false);
    expect(permission.canAccessAllNotes).toBe(false);
    expect(permission.isSubscribed).toBe(false);
  });

  it("grants all note CRUD permissions when user completes payment (PRO/TEAM)", async () => {
    // 결제 완료 시뮬레이션
    await subscriptionRepository.activatePlan("PRO");

    const permission = await checkPermissionUseCase.execute();
    expect(permission.canCreate).toBe(true);
    expect(permission.canUpdate).toBe(true);
    expect(permission.canDelete).toBe(true);
    expect(permission.canAccessAllNotes).toBe(true);
    expect(permission.isSubscribed).toBe(true);
  });

  it("throws error when trying to delete note without payment permission", async () => {
    await expect(deleteNoteUseCase.execute("note-1")).rejects.toThrowError(
      /결제가 완료된 회원만 노트를 삭제할 수 있습니다/i
    );
  });

  it("successfully deletes note when user is subscribed", async () => {
    await subscriptionRepository.activatePlan("PRO");
    const result = await deleteNoteUseCase.execute("note-1");
    expect(result).toBe(true);
  });
});
