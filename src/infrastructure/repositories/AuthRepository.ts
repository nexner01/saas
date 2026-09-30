import { User } from "@/src/core/domain/User";
import { SubscriptionRepository } from "./SubscriptionRepository";
import { supabase } from "../database/supabaseClient";

const CURRENT_USER_STORAGE_KEY = "noteflow_current_user";

// 사전 등록된 테스트 사용자 정의
export const PRESET_USERS: Record<string, { user: User; password: string }> = {
  "test1@test.com": {
    user: {
      id: "usr_test1_free",
      email: "test1@test.com",
      name: "테스터 1 (일반회원)",
      plan: "FREE",
      isSubscribed: false,
      avatarText: "T1",
    },
    password: "Test123!",
  },
  "test2@test.com": {
    user: {
      id: "usr_test2_pro",
      email: "test2@test.com",
      name: "테스터 2 (프로회원)",
      plan: "PRO",
      isSubscribed: true,
      avatarText: "T2",
    },
    password: "Test123!",
  },
};

let memoryCurrentUser: User | null = PRESET_USERS["test1@test.com"].user;

export class AuthRepository {
  private subscriptionRepository: SubscriptionRepository;

  constructor() {
    this.subscriptionRepository = new SubscriptionRepository();
  }

  getCurrentUser(): User | null {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return memoryCurrentUser;
  }

  private setCurrentUser(user: User | null): void {
    memoryCurrentUser = user;
    if (typeof window !== "undefined" && window.localStorage) {
      if (user) {
        window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    }
  }

  async signIn(email: string, password?: string): Promise<User> {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. 사전 정의된 사용자 확인 (test1@test.com / test2@test.com)
    if (PRESET_USERS[trimmedEmail]) {
      const preset = PRESET_USERS[trimmedEmail];
      if (password && preset.password !== password) {
        throw new Error("비밀번호가 올바르지 않습니다.");
      }

      this.setCurrentUser(preset.user);

      // 사용자의 구독 상태를 SubscriptionRepository와 동기화
      if (preset.user.isSubscribed) {
        await this.subscriptionRepository.activatePlan(preset.user.plan);
      } else {
        this.subscriptionRepository.reset();
      }

      return preset.user;
    }

    // 2. Supabase Auth 시도
    try {
      if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (!error && data.user) {
          const user: User = {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            name: data.user.user_metadata?.name || trimmedEmail.split("@")[0],
            plan: "FREE",
            isSubscribed: false,
            avatarText: trimmedEmail.slice(0, 2).toUpperCase(),
          };
          this.setCurrentUser(user);
          this.subscriptionRepository.reset();
          return user;
        }
      }
    } catch {
      // Supabase 연결 실패 시 fallback
    }

    // Fallback: 임의 이메일 로그인 시 기본 FREE 사용자 생성
    const fallbackUser: User = {
      id: `usr_${Date.now()}`,
      email: trimmedEmail,
      name: trimmedEmail.split("@")[0],
      plan: "FREE",
      isSubscribed: false,
      avatarText: trimmedEmail.slice(0, 2).toUpperCase(),
    };
    this.setCurrentUser(fallbackUser);
    this.subscriptionRepository.reset();
    return fallbackUser;
  }

  async signOut(): Promise<void> {
    this.setCurrentUser(null);
    this.subscriptionRepository.reset();
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  async switchUser(email: string): Promise<User> {
    return await this.signIn(email, "Test123!");
  }
}
