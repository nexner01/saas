import { UserPlan, UserSubscription } from "@/src/core/domain/Subscription";
import { ISubscriptionRepository } from "@/src/core/domain/ISubscriptionRepository";

const STORAGE_KEY = "noteflow_subscription";

let memorySubscription: UserSubscription = {
  plan: "FREE",
  isSubscribed: false,
};

export class SubscriptionRepository implements ISubscriptionRepository {
  async getSubscription(): Promise<UserSubscription> {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return memorySubscription;
  }

  async activatePlan(plan: UserPlan, orderId?: string): Promise<UserSubscription> {
    const updated: UserSubscription = {
      plan,
      isSubscribed: plan === "PRO" || plan === "TEAM",
      activatedAt: new Date().toISOString(),
      orderId,
    };

    memorySubscription = updated;

    if (typeof window !== "undefined") {
      if (window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      window.dispatchEvent(new Event("noteflow_subscription_changed"));
    }

    return updated;
  }

  reset(): void {
    memorySubscription = {
      plan: "FREE",
      isSubscribed: false,
    };
    if (typeof window !== "undefined") {
      if (window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      window.dispatchEvent(new Event("noteflow_subscription_changed"));
    }
  }
}
