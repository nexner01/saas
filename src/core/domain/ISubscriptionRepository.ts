import { UserPlan, UserSubscription } from "./Subscription";

export interface ISubscriptionRepository {
  getSubscription(): Promise<UserSubscription>;
  activatePlan(plan: UserPlan, orderId?: string): Promise<UserSubscription>;
  reset(): void;
}
