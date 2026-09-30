"use client";

import React, { useState, useMemo } from "react";
import { BillingRepository } from "@/src/infrastructure/repositories/BillingRepository";
import { SubscriptionRepository } from "@/src/infrastructure/repositories/SubscriptionRepository";
import { PaymentHistoryRepository } from "@/src/infrastructure/repositories/PaymentHistoryRepository";
import { IssueBillingKeyUseCase } from "@/src/core/use-cases/IssueBillingKeyUseCase";
import { ChargeBillingUseCase } from "@/src/core/use-cases/ChargeBillingUseCase";

interface TossBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  customerKey: string;
  planName: string;
  amount: number;
}

export const TossBillingModal: React.FC<TossBillingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  customerKey,
  planName,
  amount,
}) => {
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const billingRepository = useMemo(() => new BillingRepository(), []);
  const subscriptionRepository = useMemo(() => new SubscriptionRepository(), []);
  const paymentHistoryRepository = useMemo(() => new PaymentHistoryRepository(), []);

  const chargeBillingUseCase = useMemo(
    () =>
      new ChargeBillingUseCase(
        billingRepository,
        subscriptionRepository,
        paymentHistoryRepository
      ),
    [billingRepository, subscriptionRepository, paymentHistoryRepository]
  );
  const issueBillingKeyUseCase = useMemo(
    () => new IssueBillingKeyUseCase(billingRepository, undefined, chargeBillingUseCase),
    [billingRepository, chargeBillingUseCase]
  );

  if (!isOpen) return null;

  const handleRegisterBillingAndCharge = async () => {
    if (!agreed) {
      alert("정기 결제 약관에 동의해 주세요.");
      return;
    }

    setLoading(true);
    try {
      // 1. 빌링키 발급 및 1회차 첫 정기 결제 원스톱 자동 승인 (30일 주기 시작)
      const mockAuthKey = `AUTH_MOCK_${Date.now()}`;
      await issueBillingKeyUseCase.execute({
        customerKey,
        authKey: mockAuthKey,
        plan: planName.toUpperCase().includes("TEAM") ? "TEAM" : "PRO",
        amount,
        cardCompany: "토스뱅크",
        cardNumber: "4330-****-****-9821",
        autoCharge: true,
      });

      onSuccess?.();
      onClose();
    } catch (err: any) {
      alert(`정기 결제 등록 및 첫 결제 실패: ${err.message || "오류가 발생했습니다."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="font-bold text-base text-on-surface">
              토스페이먼츠 정기 결제 카드 등록
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            title="닫기"
          >
            <span className="material-symbols-outlined text-lg leading-none">close</span>
          </button>
        </div>

        {/* 30-Day Recurring Interval Notification */}
        <div className="px-6 py-3 bg-primary-fixed/20 border-b border-outline-variant/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">
              autorenew
            </span>
            <span className="text-on-surface-variant font-medium">
              30일마다 자동으로 갱신되는 정기 결제
            </span>
          </div>
          <span className="font-bold text-primary font-mono text-sm">
            ₩{amount.toLocaleString()}/30일
          </span>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs">
          {/* Card Registration Preview Box */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <span className="text-on-surface-variant font-medium">등록 예정 카드</span>
              <span className="font-bold text-on-surface flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                토스뱅크 체크카드 (4330-****)
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <span className="text-on-surface-variant font-medium">기본 결제 주기</span>
              <span className="font-bold text-primary font-mono">30일 (자동 갱신)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-medium">다음 결제 예정일</span>
              <span className="font-mono text-on-surface">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
                  "ko-KR"
                )}
              </span>
            </div>
          </div>

          {/* Secure Notice */}
          <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant flex items-start gap-2.5">
            <span className="material-symbols-outlined text-base text-primary shrink-0 mt-0.5">
              verified_user
            </span>
            <p className="text-[11px] leading-relaxed">
              토스페이먼츠 전자금융 결제 시스템을 통해 카드 번호는 암호화되어 안전하게 빌링키로 변환 보관되며, 언제든 구독 설정에서 해지하실 수 있습니다.
            </p>
          </div>

          {/* Agreement Checkbox */}
          <label className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container-low cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary"
            />
            <span className="text-[11px] text-on-surface">
              [필수] 정기 결제 이용약관 및 30일 주기 자동 결제에 동의합니다.
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-outline-variant/20 bg-surface-container-lowest flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface font-semibold text-xs transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleRegisterBillingAndCharge}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-semibold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined text-base animate-spin">
                progress_activity
              </span>
            ) : (
              <span>정기 결제 카드 등록 및 시작</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
