"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "../common/BrandLogo";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";
import { RecordPaymentTransactionUseCase } from "@/src/core/use-cases/RecordPaymentTransactionUseCase";

interface PaymentSuccessPageProps {
  orderId?: string;
  amount?: number;
  planName?: string;
  paymentKey?: string;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({
  orderId = "NF-20250515-883492",
  amount = 115200,
  planName = "Noteflow Pro 연간 멤버십 (1년)",
  paymentKey,
}) => {
  const [copied, setCopied] = useState(false);

  // 결제 완료 시 구독 활성화 및 트랜잭션 SUCCESS 상태 기록
  useEffect(() => {
    const subRepo = new SubscriptionRepository();
    const plan = planName.toLowerCase().includes("team") ? "TEAM" : "PRO";
    subRepo.activatePlan(plan, orderId);

    const paymentRepo = new PaymentHistoryRepository();
    const recordUseCase = new RecordPaymentTransactionUseCase(paymentRepo);
    recordUseCase.completePayment(orderId, paymentKey);
  }, [planName, orderId, paymentKey]);

  const supplyAmount = Math.round(amount / 1.1);
  const vatAmount = amount - supplyAmount;

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <BrandLogo size="md" href="/" />
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-all"
          >
            내 워크스페이스로 이동하기
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-16 bg-surface">
        <div className="relative w-full overflow-hidden pb-20">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-primary-fixed/40 via-tertiary-fixed/20 to-transparent blur-3xl pointer-events-none rounded-full" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {/* Live Sync Notice */}
            <div className="flex items-center justify-between bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-xs border border-outline-variant/20 mb-8">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  구독 플랜 활성화 완료: 모든 워크스페이스 엔드포인트에 실시간 동기화되었습니다.
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-on-surface-variant/70">
                <span>TXID: #883492</span>
              </div>
            </div>

            {/* Hero Success Banner */}
            <div className="text-center flex flex-col items-center mb-10">
              <div className="relative mb-5 flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-pulse" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-primary flex items-center justify-center shadow-lg text-white">
                  <span className="material-symbols-outlined text-[32px]">check</span>
                </div>
              </div>
              <span className="text-xs uppercase tracking-wider text-primary font-semibold mb-2 px-3 py-1 bg-primary-fixed/50 rounded-full">
                Pro Subscription Activated
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
                결제가 성공적으로 완료되었습니다!
              </h1>
              <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed text-balance">
                이제 Noteflow Pro의 모든 프리미엄 기능과 무제한 AI 도구를 워크스페이스 전역에서 지연 없이 사용하실 수 있습니다.
              </p>
            </div>

            {/* Order Summary & Receipt Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
              {/* Receipt Card */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-start justify-between pb-6 mb-6 border-b border-outline-variant/20">
                  <div>
                    <span className="text-xs text-on-surface-variant">정기 결제 플랜</span>
                    <h3 className="text-base font-bold text-on-surface mt-0.5">{planName}</h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-fixed/40 text-primary text-xs font-semibold">
                      <span className="material-symbols-outlined text-[14px]">bolt</span>
                      <span>연간 20% 특별 할인 적용됨</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-on-surface-variant block">주문 번호</span>
                    <span className="font-mono text-xs text-on-surface font-semibold select-all">
                      {orderId}
                    </span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 pb-6">
                  <div className="flex justify-between items-center text-xs text-on-surface-variant">
                    <span>결제 일시</span>
                    <span className="text-on-surface font-medium font-mono">
                      {new Date().toLocaleString("ko-KR")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-on-surface-variant">
                    <span>결제 수단</span>
                    <div className="flex items-center gap-1.5 text-on-surface">
                      <span className="px-1.5 py-0.5 bg-surface-container-high rounded font-mono text-[10px] font-bold text-on-surface-variant">
                        TOSS
                      </span>
                      <span className="font-medium">토스페이먼츠 간편결제</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-on-surface-variant">
                    <span>공급가액</span>
                    <span className="font-mono text-on-surface">₩{supplyAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-on-surface-variant">
                    <span>부가가치세 (VAT 10%)</span>
                    <span className="font-mono text-on-surface">₩{vatAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Total Bar */}
                <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between mb-4 border border-outline-variant/20">
                  <div>
                    <span className="text-xs text-on-surface-variant block font-medium">총 결제 금액</span>
                    <span className="text-[11px] text-primary font-medium">전자세금계산서/현금영수증 발행 대상</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-primary font-mono tracking-tight">
                      ₩{amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyOrderId}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                    <span>{copied ? "주문번호 복사됨!" : "주문번호 복사"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    <span>영수증 인쇄</span>
                  </button>
                </div>
              </div>

              {/* Right: Activated Pro Features Matrix */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col gap-5">
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>즉시 활성화된 Pro 플랜 혜택</span>
                </div>

                <ul className="space-y-3 text-xs text-on-surface-variant">
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    <span className="text-on-surface font-semibold">무제한 기기 동시 연결 및 동기화</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    <span className="text-on-surface font-semibold">Noteflow AI 자동 요약 & 스마트 태깅 무제한</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    <span className="text-on-surface font-semibold">50GB 대용량 클라우드 스토리지 즉시 증설</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    <span className="text-on-surface font-semibold">버전 히스토리 무제한 열람 및 1클릭 복원</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-base text-primary">check_circle</span>
                    <span className="text-on-surface font-semibold">오프라인 모드 암호화 로컬 캐싱</span>
                  </li>
                </ul>

                <div className="mt-4 pt-4 border-t border-outline-variant/20">
                  <Link
                    href="/dashboard"
                    className="w-full py-3.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>내 워크스페이스로 이동하기</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
