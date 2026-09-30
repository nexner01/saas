"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "../common/BrandLogo";
import { TossPaymentWidgetModal } from "./TossPaymentWidgetModal";
import { TossBillingModal } from "./TossBillingModal";
import { usePaymentHistory } from "@/src/presentation/hooks/usePaymentHistory";
import { useAuth } from "@/src/presentation/hooks/useAuth";
import { BillingRepository } from "@/src/infrastructure/repositories/BillingRepository";
import { BillingSubscription } from "@/src/core/domain/Billing";

export const PaymentPage: React.FC = () => {
  const { latestTransaction } = usePaymentHistory();
  const { currentUser } = useAuth();
  const customerKey = currentUser?.id || "CUST_DEFAULT";

  const [activeBilling, setActiveBilling] = useState<BillingSubscription | null>(null);
  const [charging, setCharging] = useState(false);
  const [chargeSuccessMsg, setChargeSuccessMsg] = useState<string | null>(null);

  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<{
    orderName: string;
    amount: number;
    planName: string;
  } | null>(null);

  // 빌링 결제 모달 상태
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [billingPlan, setBillingPlan] = useState<{
    planName: string;
    amount: number;
  } | null>(null);

  useEffect(() => {
    const fetchBilling = async () => {
      const repo = new BillingRepository();
      const b = await repo.getByCustomerKey(customerKey);
      setActiveBilling(b);
    };
    fetchBilling();
  }, [customerKey, isBillingModalOpen]);

  // 저장된 빌링키로 정기 결제 즉시 실행 엔드포인트 호출
  const handleExecuteRecurringCharge = async () => {
    if (!activeBilling) return;
    setCharging(true);
    setChargeSuccessMsg(null);
    try {
      const res = await fetch("/api/payments/billing/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerKey,
          orderName: `Noteflow ${activeBilling.plan} 30일 정기 구독 연장`,
          amount: activeBilling.amount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChargeSuccessMsg("30일 정기 결제가 성공적으로 실행되어 멤버십이 30일 연장되었습니다!");
        const repo = new BillingRepository();
        const b = await repo.getByCustomerKey(customerKey);
        setActiveBilling(b);
      } else {
        alert(data.error || "정기 결제 실행 실패");
      }
    } catch {
      alert("정기 결제 엔드포인트 호출 중 오류가 발생했습니다.");
    } finally {
      setCharging(false);
    }
  };

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Pricing calculations
  const proMonthlyDisplay = isAnnual ? "₩9,600" : "₩12,000";
  const proAnnualNotice = isAnnual
    ? "연간 결제 시 ₩115,200 청구 (20% 할인 적용)"
    : "월간 정기 결제 (언제든 취소 가능)";
  const proPaymentAmount = isAnnual ? 115200 : 12000;
  const proOrderName = isAnnual
    ? "Noteflow Pro 연간 멤버십 (1년)"
    : "Noteflow Pro 월간 멤버십 (1개월)";

  const teamMonthlyDisplay = isAnnual ? "₩22,400" : "₩28,000";
  const teamAnnualNotice = isAnnual
    ? "연간 결제 시 20% 할인 (유저당 ₩268,800/년)"
    : "월간 청구 방식 (멤버 변동에 따라 일할 계산)";

  const handleStartPro = () => {
    setBillingPlan({
      planName: "Pro",
      amount: proPaymentAmount,
    });
    setIsBillingModalOpen(true);
  };

  const handleStartTeam = () => {
    setBillingPlan({
      planName: "Team",
      amount: isAnnual ? 268800 : 28000,
    });
    setIsBillingModalOpen(true);
  };

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30">
        <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <BrandLogo size="md" href="/" />
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                제품 기능
              </Link>
              <Link href="/#templates" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                템플릿
              </Link>
              <span className="text-sm font-bold text-primary">요금제</span>
              <Link href="/#enterprise" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
                엔터프라이즈
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2"
            >
              대시보드로 가기
            </Link>
            <button
              onClick={handleStartPro}
              className="inline-flex items-center justify-center text-sm font-semibold text-on-primary bg-primary hover:bg-primary-container px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              무료 체험 시작
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">
          {/* Subtle Ambient Glow */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-primary-fixed/50 blur-[130px] rounded-full pointer-events-none -z-10" />
            <div className="absolute top-96 right-10 w-[420px] h-[320px] bg-secondary-fixed/40 blur-[120px] rounded-full pointer-events-none -z-10" />

            {/* Header Section */}
            <section className="max-w-6xl mx-auto px-6 lg:px-12 pt-12 pb-16 text-center">
              {/* Payment Status Notification Banner (if any) */}
              {latestTransaction && (
                <div className="max-w-2xl mx-auto mb-8">
                  {latestTransaction.status === "CANCELLED" && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-high border border-outline-variant/30 text-xs text-on-surface-variant text-left animate-fade-in">
                      <span className="material-symbols-outlined text-amber-500 text-xl">info</span>
                      <div>
                        <p className="font-semibold text-on-surface">이전 결제가 취소되었습니다.</p>
                        <p className="text-[11px] text-on-surface-variant">원하시는 플랜을 선택하여 언제든 다시 안전 결제를 진행하실 수 있습니다.</p>
                      </div>
                    </div>
                  )}
                  {latestTransaction.status === "FAILED" && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-error/10 border border-error/20 text-xs text-error text-left animate-fade-in">
                      <span className="material-symbols-outlined text-error text-xl">error</span>
                      <div>
                        <p className="font-semibold">최근 결제 시도가 승인되지 않았습니다 ({latestTransaction.errorCode || "결제 실패"}).</p>
                        <p className="text-[11px] text-error/80">{latestTransaction.failureReason || "카드 한도 또는 잔액을 확인 후 다시 시도해 주세요."}</p>
                      </div>
                    </div>
                  )}
                  {latestTransaction.status === "SUCCESS" && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 text-left animate-fade-in">
                      <span className="material-symbols-outlined text-emerald-600 text-xl">check_circle</span>
                      <div>
                        <p className="font-semibold">멤버십 결제가 성공적으로 완료되었습니다.</p>
                        <p className="text-[11px] opacity-80">현재 유료 플랜 혜택이 정상 적용되어 있습니다.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Active Billing Subscription Status & Recurring Execution Trigger */}
              {activeBilling && activeBilling.status === "ACTIVE" && (
                <div className="max-w-2xl mx-auto mb-8 p-5 rounded-2xl bg-surface-container-low border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-sm animate-fade-in">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-2xl">credit_card</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-on-surface">
                          등록된 정기 결제 카드: {activeBilling.cardCompany} ({activeBilling.cardNumber.slice(-4)})
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                          30일 주기 활성
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        다음 결제 예정일: {new Date(activeBilling.nextBillingDate).toLocaleDateString("ko-KR")} (30일 주기 자동 결제)
                      </p>
                      {chargeSuccessMsg && (
                        <p className="text-[11px] text-primary font-semibold mt-1">
                          ✓ {chargeSuccessMsg}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleExecuteRecurringCharge}
                    disabled={charging}
                    className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs transition-all shadow-xs shrink-0 flex items-center gap-2 cursor-pointer"
                  >
                    {charging ? (
                      <span className="material-symbols-outlined text-sm animate-spin">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-sm">autorenew</span>
                    )}
                    <span>정기 결제 즉시 실행</span>
                  </button>
                </div>
              )}

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold mb-6 shadow-sm">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>전 세계 120,000+ 지식 근로자가 선택한 스마트 노트</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight max-w-3xl mx-auto text-balance leading-tight">
                당신의 생산성을 극대화하는 플랜을 선택하세요
              </h1>
              <p className="mt-4 text-base text-on-surface-variant max-w-xl mx-auto text-balance leading-relaxed">
                생각을 정돈하고, 지식을 자산으로 전환하세요. 언제든 위약금 없이 업그레이드, 다운그레이드 또는 취소가 가능합니다.
              </p>

              {/* Billing Toggle Switch */}
              <div className="mt-10 inline-flex items-center gap-3 p-1.5 rounded-full bg-surface-container shadow-inner">
                <button
                  type="button"
                  onClick={() => setIsAnnual(false)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    !isAnnual
                      ? "bg-surface-container-lowest text-primary font-bold shadow-md"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  월간 결제
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnual(true)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isAnnual
                      ? "bg-surface-container-lowest text-primary font-bold shadow-md"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span>연간 결제</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold shadow-sm">
                    20% 할인 + 2개월 무료
                  </span>
                </button>
              </div>
            </section>

            {/* Pricing Cards 3-Tier Grid */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {/* Starter Card */}
                <div className="flex flex-col justify-between p-8 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-on-surface">스타터</span>
                      <span className="font-mono text-xs px-2.5 py-1 rounded bg-surface-container text-on-surface-variant">FREE</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                      개인적인 생각 정리와 매일의 메모를 가볍게 시작하고 싶은 입문자용 기본 플랜
                    </p>
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl font-extrabold text-on-surface tracking-tight">₩0</span>
                      <span className="text-xs text-on-surface-variant">/ 평생 무료</span>
                    </div>
                    <div className="h-px w-full bg-surface-container mb-6" />
                    <p className="text-xs font-semibold text-on-surface mb-4 tracking-wide uppercase">포함된 주요 혜택</p>
                    <ul className="space-y-3 text-xs text-on-surface-variant">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-tertiary-container mt-0.5">check_circle</span>
                        <span className="text-on-surface">무제한 기본 블록 및 텍스트 노트</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-tertiary-container mt-0.5">check_circle</span>
                        <span className="text-on-surface">최대 3대 기기 실시간 동기화</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-tertiary-container mt-0.5">check_circle</span>
                        <span className="text-on-surface">500MB 클라우드 스토리지</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-tertiary-container mt-0.5">check_circle</span>
                        <span>최근 7일 버전 히스토리 보관</span>
                      </li>
                      <li className="flex items-start gap-2.5 opacity-40">
                        <span className="material-symbols-outlined text-[18px] text-outline mt-0.5">remove</span>
                        <span>Noteflow AI 스마트 태깅 및 요약</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 pt-6">
                    <button
                      disabled
                      className="w-full py-3.5 px-4 rounded-lg bg-surface-container text-on-surface-variant text-xs font-semibold cursor-not-allowed text-center transition-all opacity-70"
                    >
                      현재 이용 중인 플랜
                    </button>
                  </div>
                </div>

                {/* Pro Card (Most Popular, Elevated Glow) */}
                <div className="relative flex flex-col justify-between p-8 rounded-xl bg-surface-container-lowest shadow-xl ring-2 ring-primary-container shadow-primary/10 -mt-2 lg:-mt-4 mb-2 lg:mb-0 border border-primary/20">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span>가장 인기 있는 선택</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4 mt-2">
                      <span className="text-xl font-bold text-primary">프로 (Pro)</span>
                      <span className="font-mono text-xs px-2.5 py-1 rounded bg-primary-fixed text-primary font-semibold">
                        BEST VALUE
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                      방대한 지식을 다루는 연구원, 개발자 및 전문가를 위한 올인원 AI 지식베이스
                    </p>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-4xl font-extrabold text-on-surface tracking-tight font-mono">
                        {proMonthlyDisplay}
                      </span>
                      <span className="text-xs text-on-surface-variant">/ 월</span>
                    </div>
                    <p className="text-xs text-primary mb-7 font-medium">
                      {proAnnualNotice}
                    </p>
                    <div className="h-px w-full bg-surface-container mb-6" />
                    <p className="text-xs font-semibold text-on-surface mb-4 tracking-wide uppercase">스타터의 모든 기능과 더불어</p>
                    <ul className="space-y-3 text-xs text-on-surface-variant">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span className="text-on-surface font-medium">무제한 기기 동시 연결 및 동기화</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span className="text-on-surface font-medium">AI 자동 요약, 스마트 태깅 및 Q&amp;A (무제한)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span className="text-on-surface">50GB 대용량 클라우드 (단일 파일 최대 5GB)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span className="text-on-surface">버전 히스토리 무제한 열람 및 1클릭 복원</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span className="text-on-surface">PDF / Markdown / LaTeX 고급 내보내기</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 pt-6">
                    <button
                      type="button"
                      onClick={handleStartPro}
                      className="w-full py-3.5 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold text-center shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      Pro 플랜 시작하기 (14일 무료 체험)
                    </button>
                    <p className="text-center text-[11px] text-on-surface-variant mt-2.5">
                      체험 기간 중 언제든 비용 없이 해지 가능
                    </p>
                  </div>
                </div>

                {/* Team Card */}
                <div className="flex flex-col justify-between p-8 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-on-surface">팀 워크스페이스</span>
                      <span className="font-mono text-xs px-2.5 py-1 rounded bg-surface-container text-on-surface-variant">COLLAB</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                      프로젝트와 지식을 공유하고 매끄럽게 협업하는 고성능 팀 및 조직을 위한 솔루션
                    </p>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-4xl font-extrabold text-on-surface tracking-tight font-mono">
                        {teamMonthlyDisplay}
                      </span>
                      <span className="text-xs text-on-surface-variant">/ 유저 / 월</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-7">
                      {teamAnnualNotice}
                    </p>
                    <div className="h-px w-full bg-surface-container mb-6" />
                    <p className="text-xs font-semibold text-on-surface mb-4 tracking-wide uppercase">프로의 모든 기능과 더불어</p>
                    <ul className="space-y-3 text-xs text-on-surface-variant">
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">group</span>
                        <span className="text-on-surface font-medium">초저지연 실시간 캔버스 동시 편집 &amp; 커서 공유</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">admin_panel_settings</span>
                        <span className="text-on-surface font-medium">세분화된 워크스페이스 그룹 및 역할 권한 관리</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">shield</span>
                        <span className="text-on-surface">99.9% 가동 시간 보장 (SLA 협약)</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">support_agent</span>
                        <span className="text-on-surface">한국어 우선 기술 지원 및 1:1 온보딩 매니저</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 pt-6">
                    <button
                      type="button"
                      onClick={handleStartTeam}
                      className="w-full py-3.5 px-4 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold text-center active:scale-[0.99] transition-all cursor-pointer"
                    >
                      팀 플랜 시작하기
                    </button>
                    <p className="text-center text-[11px] text-on-surface-variant mt-2.5">엔터프라이즈 맞춤 계약은 영업팀 문의</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Guarantee Badge */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
              <div className="p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">14일 무조건 100% 전액 환불 보장</h3>
                    <p className="text-xs text-on-surface-variant">제품에 만족하지 못하셨다면 클릭 한 번으로 전액 환불을 보장합니다.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-primary">lock</span>
                    <span>SSL 256-bit 암호화</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-primary">credit_card</span>
                    <span>토스페이먼츠 안전 결제</span>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Accordion Section */}
            <section className="max-w-4xl mx-auto px-6 lg:px-12 pb-24">
              <h2 className="text-2xl font-bold text-center text-on-surface mb-8">자주 묻는 질문 (FAQ)</h2>
              <div className="space-y-3">
                {[
                  {
                    q: "결제 수단은 어떤 것들이 지원되나요?",
                    a: "국내 모든 신용/체크카드, 토스페이, 카카오페이, 네이버페이, 가상계좌 및 계좌이체를 모두 안전하게 지원합니다.",
                  },
                  {
                    q: "14일 무료 체험 기간 도중 해지하면 요금이 청구되나요?",
                    a: "아닙니다. 14일 체험 기간 종료 전까지 언제든 마이페이지에서 위약금 없이 1클릭으로 해지하실 수 있으며 요금이 청구되지 않습니다.",
                  },
                  {
                    q: "기존 노트 및 데이터는 안전하게 보존되나요?",
                    a: "플랜 변경 또는 해지 시에도 기존에 작성하신 모든 노트와 데이터는 삭제되지 않고 안전하게 보관됩니다.",
                  },
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-xs text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span
                        className={`material-symbols-outlined text-sm transition-transform ${
                          openFaq === idx ? "rotate-180" : ""
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="px-6 pb-4 pt-1 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/10">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Toss Payments Billing Modal (Recurring Payment) */}
      {billingPlan && (
        <TossBillingModal
          isOpen={isBillingModalOpen}
          onClose={() => {
            setIsBillingModalOpen(false);
            setBillingPlan(null);
          }}
          onSuccess={() => {
            setIsBillingModalOpen(false);
            setBillingPlan(null);
          }}
          customerKey={customerKey}
          planName={billingPlan.planName}
          amount={billingPlan.amount}
        />
      )}

      {/* Toss Payments Widget Modal (Fallback) */}
      {selectedPlan && (
        <TossPaymentWidgetModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          orderName={selectedPlan.orderName}
          amount={selectedPlan.amount}
          planName={selectedPlan.planName}
        />
      )}
    </div>
  );
};
