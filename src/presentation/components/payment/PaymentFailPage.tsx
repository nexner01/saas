"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrandLogo } from "../common/BrandLogo";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";
import { RecordPaymentTransactionUseCase } from "@/src/core/use-cases/RecordPaymentTransactionUseCase";

export const PaymentFailContent: React.FC = () => {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code") || "PAY_PROCESS_FAILED";
  const errorMessage =
    searchParams.get("message") || "결제 진행 중 오류가 발생하였습니다.";
  const orderId =
    searchParams.get("orderId") ||
    `NF-FAIL-${Date.now()}`;

  const repository = useMemo(() => new PaymentHistoryRepository(), []);
  const recordUseCase = useMemo(
    () => new RecordPaymentTransactionUseCase(repository),
    [repository]
  );

  const [recorded, setRecorded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const recordFailure = async () => {
      try {
        await recordUseCase.failPayment(orderId, errorCode, errorMessage);
        if (mounted) {
          setRecorded(true);
        }
      } catch (err) {
        console.error("Failed to record failed payment transaction:", err);
      }
    };

    recordFailure();
    return () => {
      mounted = false;
    };
  }, [orderId, errorCode, errorMessage, recordUseCase]);

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-error/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between max-w-4xl w-full mx-auto relative z-10">
        <BrandLogo />
        <Link
          href="/payment"
          className="text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
        >
          요금제 페이지로 돌아가기
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-md w-full mx-auto my-12 bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-outline-variant/30 relative z-10 flex flex-col items-center text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 rounded-2xl bg-error/15 text-error flex items-center justify-center mb-6 shadow-sm">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>

        <h1 className="text-2xl font-black text-on-surface tracking-tight mb-2">
          결제에 실패하였습니다
        </h1>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
          결제 승인 처리 중 문제가 발생했습니다. 카드 한도, 잔액 또는 결제 수단 설정을 확인하신 후 다시 시도해 주세요.
        </p>

        {/* Error Info Box */}
        <div className="w-full bg-surface-container-low rounded-2xl p-4 mb-6 border border-outline-variant/20 flex flex-col gap-2.5 text-left text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
            <span className="text-on-surface-variant font-medium">에러 코드</span>
            <span className="font-mono font-bold text-error">{errorCode}</span>
          </div>
          <div className="flex flex-col gap-1 pb-2 border-b border-outline-variant/10">
            <span className="text-on-surface-variant font-medium">실패 사유</span>
            <span className="font-medium text-on-surface">{errorMessage}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant font-medium">주문 번호</span>
            <span className="font-mono text-on-surface">{orderId}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/payment"
            className="w-full py-3.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>결제 다시 시도하기</span>
          </Link>
          <Link
            href="/dashboard"
            className="w-full py-3.5 px-4 rounded-xl bg-surface-container-high text-on-surface font-semibold text-xs hover:bg-surface-container-highest transition-colors"
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-on-surface-variant relative z-10">
        결제 관련 도움이 필요하신가요?{" "}
        <a href="mailto:support@noteflow.io" className="text-primary underline">
          고객센터 문의하기
        </a>
      </footer>
    </div>
  );
};

export const PaymentFailPage: React.FC = () => {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <PaymentFailContent />
    </React.Suspense>
  );
};
