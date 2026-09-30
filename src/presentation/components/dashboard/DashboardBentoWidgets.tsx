import React, { useState } from "react";

interface DashboardBentoWidgetsProps {
  onConvertToNote: (content: string) => void;
  onOpenNote?: () => void;
}

export const DashboardBentoWidgets: React.FC<DashboardBentoWidgetsProps> = ({
  onConvertToNote,
  onOpenNote,
}) => {
  const [scratchText, setScratchText] = useState(
    "오늘 회의 핵심:\n1. 디자인 시스템 2.0 마이그레이션 일정 확정 (10월 2주차)\n2. 실시간 웹소켓 연결 지연 최적화 방안 검토"
  );

  const handleClear = () => {
    setScratchText("");
  };

  const handleConvert = () => {
    if (scratchText.trim()) {
      onConvertToNote(scratchText);
      setScratchText("");
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Quick Scratchpad */}
      <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-primary">edit_note</span>
              <span className="text-sm font-bold text-on-surface">빠른 스크래치패드</span>
            </div>
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
              실시간 자동저장
            </span>
          </div>
          <textarea
            value={scratchText}
            onChange={(e) => setScratchText(e.target.value)}
            className="w-full h-32 resize-none bg-surface-container-low rounded-lg p-3.5 text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-outline-variant/20"
            placeholder="제목 없이 즉시 아이디어를 휘갈기세요... (마크다운 지원)"
          />
        </div>
        <div className="flex items-center justify-between pt-3">
          <span className="font-mono text-xs text-on-surface-variant">
            {scratchText.length}자 입력됨
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              className="px-2.5 py-1 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs transition-colors cursor-pointer"
              type="button"
            >
              지우기
            </button>
            <button
              onClick={handleConvert}
              className="flex items-center gap-1 px-3 py-1 rounded-md bg-secondary-container text-on-secondary-container hover:bg-secondary text-xs font-medium transition-colors shadow-xs cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-sm leading-none">archive</span>
              <span>정식 노트로 전환</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. AI Suggestion & Reminder Card */}
      <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-xl bg-gradient-to-br from-primary-fixed/30 to-surface-container-lowest shadow-sm relative overflow-hidden border border-outline-variant/30">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">psychology</span>
              <span className="text-sm font-bold text-on-surface">스마트 지식 어시스턴트</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
              인사이트
            </span>
          </div>
          <div className="p-3.5 rounded-lg bg-surface-container-lowest shadow-sm flex flex-col gap-2 border border-outline-variant/20">
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-base text-primary">schedule</span>
              <span className="text-xs font-semibold">3일 전 작성한 [Q3 로드맵 초안]</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              ‘OKRs 지표 합의’ 항목이 비어있습니다. 백엔드 팀의 스프린트 회의 전에 검토 후 공유 링크를 발송해보세요.
            </p>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-sm">link</span>
            <span className="truncate">연관된 노트: 2024 하반기 사업계획서, 디자인 리소스 현황</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-3">
          <button
            className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface text-xs transition-colors cursor-pointer"
            type="button"
          >
            나중에 알림
          </button>
          <button
            onClick={onOpenNote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-medium transition-colors shadow-xs cursor-pointer"
            type="button"
          >
            <span>노트 바로 열기</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* 3. Active Sprint / Priority Progress Widget */}
      <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl text-tertiary-container">donut_large</span>
              <span className="text-sm font-bold text-on-surface">이번 주 태스크 달성도</span>
            </div>
            <span className="font-mono text-xs text-tertiary font-bold">14 / 18 완료 (78%)</span>
          </div>
          <div className="flex items-center gap-4 py-2">
            {/* Inline SVG Progress Chart */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-high"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                ></path>
                <path
                  className="text-tertiary-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="78, 100"
                  strokeLinecap="round"
                  strokeWidth="3.5"
                ></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-on-surface">
                78%
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant truncate">디자인 시스템 가이드</span>
                <span className="text-primary font-bold">완료</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant truncate">API 엔드포인트 명세화</span>
                <span className="text-tertiary font-bold">진행 중</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface-variant truncate">고객 인터뷰 데이터 정리</span>
                <span className="text-outline font-bold">대기</span>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <button
            className="inline-flex items-center gap-1 text-primary hover:text-primary-container text-xs font-semibold transition-colors cursor-pointer"
            type="button"
          >
            <span>모든 액션 아이템 보기</span>
            <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
          </button>
        </div>
      </div>
    </section>
  );
};
