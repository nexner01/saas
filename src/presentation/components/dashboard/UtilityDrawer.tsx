import React from "react";

export const UtilityDrawer: React.FC = () => {
  return (
    <aside className="flex flex-col gap-6">
      {/* 1. Interactive Knowledge Graph Mini Preview */}
      <div className="flex flex-col p-5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">hub</span>
            <span className="text-sm font-bold text-on-surface">지식 연결망 (Graph)</span>
          </div>
          <button
            className="text-on-surface-variant hover:text-primary p-1 rounded-md transition-colors cursor-pointer"
            title="전체화면 그래프"
            type="button"
          >
            <span className="material-symbols-outlined text-lg leading-none">fullscreen</span>
          </button>
        </div>
        <p className="text-xs text-on-surface-variant mb-3">
          생각과 문맥의 유기적인 연관도를 3차원 노드로 시각화합니다.
        </p>

        {/* Interactive SVG Network Graph Simulation */}
        <div className="relative w-full h-56 bg-surface-container-low rounded-xl overflow-hidden flex items-center justify-center group border border-outline-variant/20">
          <svg className="w-full h-full" viewBox="0 0 320 220">
            {/* Connecting lines */}
            <line className="text-outline-variant" stroke="currentColor" strokeDasharray="3,3" strokeWidth="1.5" x1="160" x2="80" y1="110" y2="60"></line>
            <line className="text-outline-variant" stroke="currentColor" strokeWidth="1.5" x1="160" x2="240" y1="110" y2="70"></line>
            <line className="text-outline-variant" stroke="currentColor" strokeWidth="2" x1="160" x2="190" y1="110" y2="170"></line>
            <line className="text-outline-variant" stroke="currentColor" strokeWidth="1.5" x1="160" x2="90" y1="110" y2="160"></line>
            <line className="text-outline-variant" stroke="currentColor" strokeDasharray="2,2" strokeWidth="1" x1="80" x2="240" y1="60" y2="70"></line>
            <line className="text-outline-variant" stroke="currentColor" strokeWidth="1.5" x1="190" x2="270" y1="170" y2="150"></line>

            {/* Peripheral Nodes */}
            <g className="cursor-pointer transition-transform hover:scale-110">
              <circle className="fill-surface-container-high" cx="80" cy="60" r="14"></circle>
              <circle className="fill-primary" cx="80" cy="60" r="6"></circle>
              <text className="text-[10px] fill-on-surface font-medium" textAnchor="middle" x="80" y="86">#기획</text>
            </g>
            <g className="cursor-pointer transition-transform hover:scale-110">
              <circle className="fill-secondary-fixed" cx="240" cy="70" r="16"></circle>
              <circle className="fill-secondary" cx="240" cy="70" r="7"></circle>
              <text className="text-[10px] fill-on-surface font-medium" textAnchor="middle" x="240" y="98">#디자인토큰</text>
            </g>
            <g className="cursor-pointer transition-transform hover:scale-110">
              <circle className="fill-tertiary-fixed" cx="190" cy="170" r="15"></circle>
              <circle className="fill-tertiary" cx="190" cy="170" r="6"></circle>
              <text className="text-[10px] fill-on-surface font-medium" textAnchor="middle" x="190" y="196">#로드맵</text>
            </g>
            <g className="cursor-pointer transition-transform hover:scale-110">
              <circle className="fill-surface-container-high" cx="90" cy="160" r="12"></circle>
              <circle className="fill-outline" cx="90" cy="160" r="5"></circle>
              <text className="text-[10px] fill-on-surface font-medium" textAnchor="middle" x="90" y="184">#회의록</text>
            </g>
            <g className="cursor-pointer transition-transform hover:scale-110">
              <circle className="fill-surface-container-high" cx="270" cy="150" r="10"></circle>
              <circle className="fill-secondary-container" cx="270" cy="150" r="4"></circle>
              <text className="text-[10px] fill-on-surface font-medium" textAnchor="middle" x="270" y="172">#리서치</text>
            </g>

            {/* Central Hub Node */}
            <g className="cursor-pointer transition-transform hover:scale-110">
              <circle className="fill-primary-fixed" cx="160" cy="110" r="22"></circle>
              <circle className="fill-primary animate-pulse" cx="160" cy="110" r="10"></circle>
              <text className="text-[11px] fill-primary font-bold" textAnchor="middle" x="160" y="144">2025 디자인</text>
            </g>
          </svg>

          {/* Graph controls overlay */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-sm p-1 rounded-md shadow-xs border border-outline-variant/20">
            <button className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer" type="button">
              <span className="material-symbols-outlined text-sm leading-none">add</span>
            </button>
            <button className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer" type="button">
              <span className="material-symbols-outlined text-sm leading-none">remove</span>
            </button>
            <button className="p-1 text-on-surface-variant hover:text-on-surface cursor-pointer" type="button">
              <span className="material-symbols-outlined text-sm leading-none">center_focus_strong</span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-on-surface-variant pt-3">
          <span>연결된 노드: <strong className="text-on-surface">48개</strong></span>
          <span>양방향 링크: <strong className="text-on-surface">112개</strong></span>
        </div>
      </div>

      {/* 2. Real-time Collaboration Activity Feed */}
      <div className="flex flex-col p-5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-secondary">notifications_active</span>
            <span className="text-sm font-bold text-on-surface">실시간 협업 피드</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
        </div>
        <div className="flex flex-col gap-4">
          {/* Activity Item 1 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              지민
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface truncate">박지민</span>
                <span className="font-mono text-[11px] text-on-surface-variant shrink-0">4분 전</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                <span className="text-primary font-medium">[2025 디자인 시스템]</span> 노트에 댓글을 남겼습니다.
              </p>
              <div className="mt-1 p-2 rounded-md bg-surface-container-low text-xs text-on-surface italic border border-outline-variant/10">
                “Figma 토큰 자동 배포 스크립트 작성 완료했어요! 확인 부탁드립니다.”
              </div>
            </div>
          </div>

          {/* Activity Item 2 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              준호
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface truncate">이준호</span>
                <span className="font-mono text-[11px] text-on-surface-variant shrink-0">28분 전</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                <span className="text-primary font-medium">[CRDT 동기화 아키텍처]</span> 버전을 복원했습니다.
              </p>
            </div>
          </div>

          {/* Activity Item 3 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-base">person_add</span>
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface truncate">워크스페이스 초대</span>
                <span className="font-mono text-[11px] text-on-surface-variant shrink-0">2시간 전</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                새 멤버 <strong>김민서(QA Lead)</strong>님이 워크스페이스에 참여했습니다.
              </p>
            </div>
          </div>
        </div>

        <button
          className="w-full mt-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-xs text-center transition-colors cursor-pointer border border-outline-variant/20"
          type="button"
        >
          전체 활동 로그 보기
        </button>
      </div>
    </aside>
  );
};
