export type UserPlan = "FREE" | "PRO" | "TEAM";

export interface UserSubscription {
  plan: UserPlan;
  isSubscribed: boolean;
  activatedAt?: string;
  orderId?: string;
}

export interface NotePermissions {
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canAccessAllNotes: boolean;
  isSubscribed: boolean;
  plan: UserPlan;
}
