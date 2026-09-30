"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";
import { CheckNotePermissionUseCase } from "@/src/core/use-cases/CheckNotePermissionUseCase";
import { NotePermissions, UserSubscription } from "@/src/core/domain/Subscription";

export function useSubscription() {
  const repository = useMemo(() => new SubscriptionRepository(), []);
  const checkPermissionUseCase = useMemo(
    () => new CheckNotePermissionUseCase(repository),
    [repository]
  );

  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: "FREE",
    isSubscribed: false,
  });

  const [permissions, setPermissions] = useState<NotePermissions>({
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canAccessAllNotes: false,
    isSubscribed: false,
    plan: "FREE",
  });

  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const sub = await repository.getSubscription();
      const perms = await checkPermissionUseCase.execute();
      setSubscription(sub);
      setPermissions(perms);
    } finally {
      setLoading(false);
    }
  }, [repository, checkPermissionUseCase]);

  useEffect(() => {
    refresh();

    const handleSubscriptionChange = () => {
      refresh();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("noteflow_subscription_changed", handleSubscriptionChange);
      window.addEventListener("storage", handleSubscriptionChange);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("noteflow_subscription_changed", handleSubscriptionChange);
        window.removeEventListener("storage", handleSubscriptionChange);
      }
    };
  }, [refresh]);

  return {
    subscription,
    permissions,
    loading,
    refresh,
    activatePlan: (plan: "PRO" | "TEAM", orderId?: string) =>
      repository.activatePlan(plan, orderId).then(refresh),
  };
}
