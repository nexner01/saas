import React from "react";

export const FeatureBentoGrid: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full" id="features">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2 block">
          POWERFUL ARCHITECTURE
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight mb-4">
          지식 관리의 모든 한계를 뛰어넘는 세 가지 엔진
        </h2>
        <p className="text-base text-on-surface-variant">
          생각의 속도에 맞춰 동작합니다. 로딩 없는 경험과 유기적인 지식의 확장을 체감하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1: Real-time Cloud Sync */}
        <div className="bg-surface-container-low rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group border border-outline-variant/30">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                sync_saved_locally
              </span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3">
              실시간 클라우드 동기화
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              초고속 로컬 우선 캐싱과 비동기식 CRDT 알고리즘으로 비행기 안, 터널 속 오프라인 환경에서도 끊김 없이 기록하고 재연결 시 0.05초 만에 충돌 없이 동기화됩니다.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-inner space-y-3 border border-outline-variant/20">
            <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant">
              <span>동기화 지연율 (Latency)</span>
              <span className="text-tertiary-container font-bold">12ms (동급 최저)</span>
            </div>
            {/* Inline Sparkline Visual */}
            <div className="w-full h-8 flex items-end gap-1.5 pt-1">
              <div className="bg-primary/20 hover:bg-primary h-4 w-full rounded-sm transition-colors"></div>
              <div className="bg-primary/20 hover:bg-primary h-6 w-full rounded-sm transition-colors"></div>
              <div className="bg-primary/30 hover:bg-primary h-5 w-full rounded-sm transition-colors"></div>
              <div className="bg-primary/30 hover:bg-primary h-7 w-full rounded-sm transition-colors"></div>
              <div className="bg-primary/50 hover:bg-primary h-4 w-full rounded-sm transition-colors"></div>
              <div className="bg-primary/60 hover:bg-primary h-8 w-full rounded-sm transition-colors"></div>
              <div className="bg-primary h-8 w-full rounded-sm"></div>
            </div>
            <div className="text-xs text-tertiary-container flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>엔드투엔드 암호화 기본 지원</span>
            </div>
          </div>
        </div>

        {/* Feature 2: Smart AI Assistant */}
        <div className="bg-surface-container-low rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group border border-outline-variant/30">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3">
              스마트 AI 어시스턴트
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              긴 회의록과 음성 녹음 텍스트를 3초 만에 실행 과제로 요약하고, 문서 맥락을 분석해 최적의 태그와 목차를 자율적으로 생성합니다.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-inner space-y-2.5 border border-outline-variant/20">
            <div className="flex items-center gap-2 text-xs text-on-surface font-medium">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>지능형 맥락 추천 실행</span>
            </div>
            <div className="bg-surface-container-low p-2.5 rounded-lg text-xs text-on-surface-variant border border-outline-variant/10">
              &quot;이 메모는 <span className="text-secondary font-bold font-mono">#디자인시스템</span> 문서와 94%의 의미적 연관성을 가지고 있습니다.&quot;
            </div>
            <div className="text-xs text-secondary flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>문맥 맞춤형 자율 분류 엔진</span>
            </div>
          </div>
        </div>

        {/* Feature 3: Bi-directional Backlinks & Graph */}
        <div className="bg-surface-container-low rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group border border-outline-variant/30">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed text-tertiary flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_tree
              </span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-3">
              양방향 백링크 &amp; 지식 그래프
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              기존의 고립된 폴더식 구조를 벗어나 뇌 신경망처럼 아이디어 간의 유기적 관계망을 시각화합니다. 숨겨진 패턴과 통찰을 저절로 발견하세요.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-inner space-y-3 border border-outline-variant/20">
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">연결된 참조 링크 수</span>
              <span className="font-mono text-primary font-bold">2,419 Nodes</span>
            </div>
            {/* Progress representation for Graph Density */}
            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary h-full w-[88%] rounded-full"></div>
            </div>
            <div className="text-xs text-primary flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[16px]">grain</span>
              <span>동적 인터랙티브 3D 그래프 탐색</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
