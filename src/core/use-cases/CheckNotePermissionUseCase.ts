import { NotePermissions } from "../domain/Subscription";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";

export class CheckNotePermissionUseCase {
  constructor(private subscriptionRepository: SubscriptionRepository) {}

  async execute(): Promise<NotePermissions> {
    const sub = await this.subscriptionRepository.getSubscription();
    const isPaid = sub.plan === "PRO" || sub.plan === "TEAM";

    return {
      canCreate: isPaid,
      canUpdate: isPaid,
      canDelete: isPaid,
      canAccessAllNotes: isPaid,
      isSubscribed: isPaid,
      plan: sub.plan,
    };
  }
}
