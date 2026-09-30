import { UserPlan } from "./Subscription";

export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  isSubscribed: boolean;
  avatarText: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
}
