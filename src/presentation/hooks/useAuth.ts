"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { User } from "@/src/core/domain/User";
import { AuthRepository } from "@/src/infrastructure/repositories/AuthRepository";

export const useAuth = () => {
  const repository = useMemo(() => new AuthRepository(), []);
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    repository.getCurrentUser()
  );
  const [loading, setLoading] = useState(false);

  const refreshUser = useCallback(() => {
    setCurrentUser(repository.getCurrentUser());
  }, [repository]);

  const signIn = useCallback(
    async (email: string, password?: string) => {
      setLoading(true);
      try {
        const user = await repository.signIn(email, password);
        setCurrentUser(user);
        return user;
      } finally {
        setLoading(false);
      }
    },
    [repository]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await repository.signOut();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const switchUser = useCallback(
    async (email: string) => {
      setLoading(true);
      try {
        const user = await repository.switchUser(email);
        setCurrentUser(user);
        return user;
      } finally {
        setLoading(false);
      }
    },
    [repository]
  );

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "noteflow_current_user") {
        refreshUser();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshUser]);

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    signIn,
    signOut,
    switchUser,
    refreshUser,
  };
};
