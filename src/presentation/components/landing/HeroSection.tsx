import React from "react";
import Link from "next/link";
import { AmbientGlow } from "../common/AmbientGlow";

interface HeroSectionProps {
  onDemoClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onDemoClick }) => {
  return (
    <section className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12 flex flex-col items-center text-center overflow-hidden">
      <AmbientGlow position="top-center" />
      {/* Release Pill Badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group mb-8 border border-outline-variant/40">
        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
        <span className="text-xs text-primary font-semibold">Noteflow 3.0 출시</span>
        <span className="text-outline-variant text-xs">•</span>
        <span className="text-xs text-on-surface-variant group-hover:text-primary transition-colors">AI 어시스턴트 탑재</span>
        <span className="material-symbols-outlined text-[16px] text-primary group-hover:translate-x-0.5 transition-transform">
          arrow_forward
        </span>
      </div>

      {/* Main Catchy Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface max-w-4xl tracking-tight leading-tight text-balance mb-6">
        생각이 흐르는 곳,<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary-container">
          스마트한 클라우드 메모
        </span>의 시작
      </h1>

      {/* Subheadline */}
      <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl text-balance mb-10 leading-relaxed">
        복잡한 아이디어를 즉시 정리하고 실시간으로 연결하세요.<br className="hidden sm:inline" />
        언제 어디서나 안전하게 동기화되는 차세대 지식 워크스페이스.
      </p>

      {/* Dual CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
        <Link
          href="/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-md hover:shadow-xl hover:bg-primary-container active:scale-[0.98] transition-all"
        >
          <span>무료로 시작하기</span>
          <span className="material-symbols-outlined text-[18px]">bolt</span>
        </Link>
        <button
          onClick={onDemoClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface text-sm font-semibold shadow-sm hover:bg-surface-container-low active:scale-[0.98] transition-all group border border-outline-variant/40"
          id="interactiveDemoBtn"
        >
          <span className="material-symbols-outlined text-[20px] text-secondary group-hover:rotate-45 transition-transform">
            play_circle
          </span>
          <span>인터랙티브 데모 체험</span>
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-on-surface-variant pt-2">
        <div className="flex -space-x-2.5 overflow-hidden p-1">
          <div className="inline-flex h-8 w-8 rounded-full items-center justify-center bg-primary-fixed text-on-primary-fixed text-xs font-bold ring-2 ring-surface-container-lowest">
            KS
          </div>
          <div className="inline-flex h-8 w-8 rounded-full items-center justify-center bg-secondary-fixed text-on-secondary-fixed text-xs font-bold ring-2 ring-surface-container-lowest">
            PJ
          </div>
          <div className="inline-flex h-8 w-8 rounded-full items-center justify-center bg-tertiary-fixed text-tertiary text-xs font-bold ring-2 ring-surface-container-lowest">
            LD
          </div>
          <div className="inline-flex h-8 w-8 rounded-full items-center justify-center bg-primary text-white text-xs font-bold ring-2 ring-surface-container-lowest">
            +5k
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex text-amber-500">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <span className="text-xs font-medium text-on-surface">50,000+ 활성 사용자 및 글로벌 혁신 팀 선택</span>
        </div>
      </div>
    </section>
  );
};
