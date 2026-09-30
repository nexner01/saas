import React, { useState } from "react";
import { useRouter } from "next/navigation";

export const CtaBanner: React.FC = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24 w-full" id="pricing">
      <div className="relative rounded-3xl bg-gradient-to-r from-primary via-primary-container to-secondary p-10 md:p-16 text-center text-on-primary shadow-xl overflow-hidden">
        {/* Decorative Backdrop Circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Overline Tag */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-on-primary mb-6">
            <span className="material-symbols-outlined text-[16px]">lock_reset</span> 신용카드 등록 없이 즉시 시작
          </span>

          {/* Compelling Final Headline */}
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-balance">
            지금 바로 더 스마트한 메모 습관을 시작하세요
          </h2>

          {/* Reassurance Subtext */}
          <p className="text-base sm:text-lg text-on-primary-container max-w-xl text-balance mb-8">
            개인과 팀의 모든 영감을 하나의 유기적인 네트워크로 통합하세요. 14일간 모든 프로 및 엔터프라이즈 기능을 무료로 체험할 수 있습니다.
          </p>

          {/* CTA Form / Button Bundle */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="업무용 이메일 입력"
              className="w-full px-4 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary-fixed shadow-md"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 px-7 py-3.5 rounded-xl bg-on-primary text-primary text-sm font-bold hover:bg-surface-container-low active:scale-[0.98] transition-all shadow-md cursor-pointer"
            >
              무료 체험 시작
            </button>
          </form>

          {/* Badges Under CTA */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-on-primary-container text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">verified_user</span> 14일 무료 트라이얼
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">devices</span> 모바일 &amp; 데스크톱 무제한 동기화
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">download_for_offline</span> 1-클릭 노션 &amp; 옵시디언 마이그레이션
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
