import React from "react";

export const WorkspaceMockup: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-12 pb-24" id="workspace-demo">
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden p-3 sm:p-5 border border-outline-variant/30">
        {/* Application Chrome Bar */}
        <div className="flex items-center justify-between px-3 py-2.5 mb-3 bg-surface-container-low rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-error/70"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
            <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim"></div>
            <div className="ml-4 flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest rounded-lg shadow-sm text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-[15px] text-primary">cloud_done</span>
              <span className="font-mono font-medium">noteflow-main / 2025-전략-로드맵.md</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary-container"></span> 실시간 동기화 완료
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono">⌘ + K</span>
          </div>
        </div>

        {/* Mockup Tri-split Workspace Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Workspace Tree & Document Index */}
          <div className="hidden lg:flex lg:col-span-3 flex-col bg-surface-container-low/70 rounded-xl p-3.5 space-y-4">
            <div className="flex items-center justify-between text-on-surface-variant">
              <span className="text-xs font-bold uppercase tracking-wider text-outline">WORKSPACE</span>
              <span className="material-symbols-outlined text-[18px] hover:text-on-surface cursor-pointer">add</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-highest/60 text-primary font-semibold">
                <span className="material-symbols-outlined text-[17px]">description</span>
                <span className="truncate">2025 전략 로드맵</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[17px]">folder</span>
                <span className="truncate">Q2 신규 기능 기획서</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[17px]">hub</span>
                <span className="truncate">제품 지식 그래프</span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[17px]">smart_toy</span>
                <span className="truncate">AI 인사이트 메모리</span>
              </div>
            </div>

            {/* Taxonomy Tags */}
            <div className="pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-outline block mb-2">TAGS</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed text-xs font-medium">#기획</span>
                <span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed text-xs font-medium">#AI통합</span>
                <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-xs">#분기OKR</span>
                <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-xs">#백링크</span>
              </div>
            </div>

            {/* Mini Live Sync Metric Card */}
            <div className="mt-auto bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-1 text-on-surface">
                <span className="text-xs font-semibold">오프라인 캐시</span>
                <span className="font-mono text-tertiary-container font-bold text-xs">100%</span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                <div className="bg-tertiary-container h-full w-full rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Center: High-fidelity Markdown Editor */}
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between border border-outline-variant/30">
            <div>
              {/* Live Document Title */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-tertiary-container text-on-secondary-container font-bold">
                  LIVE DRAFT
                </span>
                <span className="text-xs text-outline-variant">방금 자동 저장됨</span>
              </div>
              <h2 className="text-lg font-bold text-on-surface mb-4">
                🚀 2025 프로덕트 비전 &amp; 지식 메쉬 아키텍처
              </h2>

              {/* Editor Content Flow */}
              <div className="space-y-3.5 text-sm text-on-surface-variant leading-relaxed">
                <p>
                  기존의 파편화된 메모 구조를 탈피하고{" "}
                  <span className="bg-primary-fixed/60 text-primary font-semibold px-1 rounded cursor-pointer">
                    [[지식 그래프]]
                  </span>
                  를 통해 모든 프로젝트 문맥을 실시간으로 상호 연결합니다.
                </p>

                {/* Checkable Block */}
                <div className="space-y-2 bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/30">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_box
                    </span>
                    <span className="line-through text-outline">엔터프라이즈 종단간 암호화(E2EE) 프로토콜 완성</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_box
                    </span>
                    <span className="line-through text-outline">CRDT 기반 멀티 디바이스 무충돌 동기화 엔진</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-outline-variant text-[20px]">
                      check_box_outline_blank
                    </span>
                    <span className="text-on-surface font-medium">컨텍스트 인지형 시맨틱 AI 오토 서머리 적용</span>
                  </div>
                </div>

                {/* Code block element */}
                <div className="bg-inverse-surface text-inverse-on-surface rounded-lg p-3 font-mono text-xs overflow-x-auto">
                  <span className="text-secondary-fixed font-bold">// Sync Hook Listener</span><br />
                  <span className="text-tertiary-fixed-dim">await</span> noteflow.<span className="text-primary-fixed">syncEngine</span>({"{"} instantCache: <span className="text-secondary-fixed">true</span>, crdtMesh: <span className="text-secondary-fixed">true</span> {"}"});
                </div>
              </div>
            </div>

            {/* Editor Bottom Status */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-outline-variant/30 bg-surface-container-low/50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl">
              <span className="font-mono text-xs text-outline">Words: 1,482 · Characters: 8,390</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span className="text-xs text-primary font-semibold">동료 3명 동시 편집 중</span>
              </div>
            </div>
          </div>

          {/* Right: Knowledge Mindmap Backlink Graph & AI Auto-Summary */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Mindmap Graph Card */}
            <div className="bg-surface-container-low rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-on-surface font-semibold text-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">bubble_chart</span>
                  <span>지식 백링크 그래프</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary font-mono text-xs font-semibold shadow-xs">
                  8 개 노드 연결
                </span>
              </div>

              {/* Inline Interactive SVG Mindmap */}
              <div className="relative w-full h-44 bg-surface-container-lowest rounded-lg overflow-hidden flex items-center justify-center p-2 shadow-inner border border-outline-variant/20">
                <svg className="w-full h-full" fill="none" viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
                  {/* Connection Lines */}
                  <line className="text-outline-variant" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1.5" x1="150" x2="60" y1="80" y2="40"></line>
                  <line className="text-primary/40" stroke="currentColor" strokeWidth="2" x1="150" x2="230" y1="80" y2="45"></line>
                  <line className="text-outline-variant" stroke="currentColor" strokeWidth="1.5" x1="150" x2="70" y1="80" y2="120"></line>
                  <line className="text-secondary/40" stroke="currentColor" strokeWidth="2" x1="150" x2="240" y1="80" y2="125"></line>
                  <line className="text-tertiary-container/30" stroke="currentColor" strokeWidth="1.5" x1="230" x2="240" y1="45" y2="125"></line>
                  {/* Central Node */}
                  <circle className="text-primary" cx="150" cy="80" fill="currentColor" r="16"></circle>
                  <circle className="text-primary/30" cx="150" cy="80" r="22" stroke="currentColor" strokeWidth="1.5"></circle>
                  <text fill="#ffffff" fontSize="9" fontWeight="700" textAnchor="middle" x="150" y="84">전략</text>
                  {/* Linked Nodes */}
                  <circle className="text-secondary" cx="60" cy="40" fill="currentColor" r="11"></circle>
                  <text fill="#ffffff" fontSize="8" textAnchor="middle" x="60" y="44">OKR</text>
                  <circle className="text-primary-container" cx="230" cy="45" fill="currentColor" r="13"></circle>
                  <text fill="#ffffff" fontSize="8" textAnchor="middle" x="230" y="48">AI메모리</text>
                  <circle className="text-outline" cx="70" cy="120" fill="currentColor" r="10"></circle>
                  <text fill="#ffffff" fontSize="7" textAnchor="middle" x="70" y="123">리서치</text>
                  <circle className="text-tertiary-container" cx="240" cy="125" fill="currentColor" r="12"></circle>
                  <text fill="#ffffff" fontSize="8" textAnchor="middle" x="240" y="128">로드맵</text>
                </svg>
                <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-outline">
                  <span className="material-symbols-outlined text-[14px]">auto_graph</span> 상호 탐색 모드 활성
                </div>
              </div>
            </div>

            {/* Dynamic AI Auto-Summary Card */}
            <div className="bg-gradient-to-br from-primary-fixed/40 to-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col justify-between border border-outline-variant/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">psychology</span>
                  </div>
                  <span className="text-sm font-bold text-on-surface">Noteflow AI 자동 요약</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
                  완료됨
                </span>
              </div>
              <div className="bg-surface-container-lowest/90 backdrop-blur rounded-lg p-3 space-y-2 text-xs text-on-surface border border-outline-variant/20">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container shrink-0 mt-0.5">check_circle</span>
                  <p className="leading-tight"><strong className="font-semibold text-primary">핵심 가치:</strong> 오프라인 우선 동기화 엔진과 CRDT 데이터 무결성 보장</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container shrink-0 mt-0.5">check_circle</span>
                  <p className="leading-tight"><strong className="font-semibold text-primary">추천 액션:</strong> 주간 스프린트 플래닝 백링크 3개 즉시 생성 제안</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between pt-1">
                <span className="text-xs text-on-surface-variant">요약 정확도 99.4%</span>
                <button className="px-2.5 py-1 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-container transition-colors shadow-xs">
                  문서에 추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
