"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { PaymentTransaction } from "@/src/core/domain/PaymentTransaction";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";
import { GetPaymentTransactionsUseCase } from "@/src/core/use-cases/GetPaymentTransactionsUseCase";

export const usePaymentHistory = () => {
  const repository = useMemo(() => new PaymentHistoryRepository(), []);
  const getTransactionsUseCase = useMemo(
    () => new GetPaymentTransactionsUseCase(repository),
    [repository]
  );

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [latestTransaction, setLatestTransaction] = useState<PaymentTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const all = await getTransactionsUseCase.getAll();
      setTransactions(all);
      setLatestTransaction(all.length > 0 ? all[0] : null);
    } finally {
      setLoading(false);
    }
  }, [getTransactionsUseCase]);

  useEffect(() => {
    refresh();

    // 결제 상태 변경 시 다른 탭/창과의 동기화
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "noteflow_payment_transactions") {
        refresh();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [refresh]);

  return {
    transactions,
    latestTransaction,
    loading,
    refresh,
  };
};
