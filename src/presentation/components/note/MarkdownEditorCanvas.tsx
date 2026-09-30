import React, { useState } from "react";
import { CodeBlock } from "../common/CodeBlock";

export const MarkdownEditorCanvas: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "온디바이스 경량 LLM(SLM)을 활용한 오프라인 문맥 자동완성 엔트리포인트 설계", checked: true },
    { id: 2, text: "다차원 문서 백링크(Bidirectional linking) 그래프 시각화 레이아웃 완료", checked: true },
    { id: 3, text: "실시간 마크다운 협업 충돌 방지를 위한 CRDT(Conflict-free Replicated Data Type) 엔진 통합", checked: false },
    { id: 4, text: "모바일 제스처 기반 빠른 카드 캡처 및 음성 녹음 실시간 STT 정리 피처 개발", checked: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)));
  };

  return (
    <main className="relative flex flex-col gap-6 px-2 min-h-[640px]">
      {/* Floating Selection Formatting Toolbar (Craft/Notion Style) */}
      <div
        className="flex items-center gap-0.5 p-1 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl z-20 backdrop-blur-md mb-2 self-start border border-outline-variant/30"
        id="selectionToolbar"
      >
        <button className="px-2 py-1 rounded hover:bg-surface-variant/30 text-inverse-on-surface transition-colors font-bold text-xs cursor-pointer" title="굵게 (Cmd+B)">
          B
        </button>
        <button className="px-2 py-1 rounded hover:bg-surface-variant/30 text-inverse-on-surface transition-colors italic text-xs cursor-pointer" title="기울임 (Cmd+I)">
          I
        </button>
        <button className="px-2 py-1 rounded hover:bg-surface-variant/30 text-inverse-on-surface transition-colors line-through text-xs cursor-pointer" title="취소선">
          S
        </button>
        <div className="w-px h-3.5 bg-inverse-on-surface/20 mx-0.5"></div>
        <button className="px-2 py-1 rounded hover:bg-surface-variant/30 text-inverse-on-surface transition-colors font-mono text-xs cursor-pointer" title="인라인 코드">
          `&lt;&gt;`
        </button>
        <button className="flex items-center gap-0.5 px-2 py-1 rounded hover:bg-surface-variant/30 text-inverse-primary transition-colors text-xs cursor-pointer" title="제목 스타일">
          <span>H2</span>
          <span className="material-symbols-outlined text-xs leading-none">arrow_drop_down</span>
        </button>
        <button className="p-1 rounded hover:bg-surface-variant/30 text-inverse-on-surface transition-colors cursor-pointer" title="하이라이트">
          <span className="material-symbols-outlined text-sm leading-none">format_ink_highlighter</span>
        </button>
        <button className="p-1 rounded hover:bg-surface-variant/30 text-inverse-on-surface transition-colors cursor-pointer" title="인용구">
          <span className="material-symbols-outlined text-sm leading-none">format_quote</span>
        </button>
        <button className="p-1 rounded hover:bg-surface-variant/30 text-inverse-on-surface transition-colors cursor-pointer" title="체크리스트 변환">
          <span className="material-symbols-outlined text-sm leading-none">check_box</span>
        </button>
        <div className="w-px h-3.5 bg-inverse-on-surface/20 mx-0.5"></div>
        <button className="flex items-center gap-1 px-2 py-1 rounded bg-primary text-on-primary text-xs font-medium hover:bg-primary-container transition-all cursor-pointer shadow-xs">
          <span className="material-symbols-outlined text-xs leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          <span>AI 편집</span>
        </button>
      </div>

      {/* Section 1: Core Objectives with Tasks */}
      <div className="flex flex-col gap-3 group" id="section-core">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-on-surface tracking-tight">1. 핵심 개발 목표 (Core Objectives)</h2>
          <span className="opacity-0 group-hover:opacity-100 text-outline hover:text-on-surface cursor-pointer text-xs font-mono transition-opacity">
            #core-goals
          </span>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          2025년 상반기 Noteflow의 최우선 과제는 사용자가 작성한 비정형 텍스트와 회의록을 자율 분석하여 지능형 지식 그래프로 연결하는 것입니다. 사용자의 키보드 흐름을 끊지 않는 극대화된 반응 속도와 실시간 로컬-클라우드 동기화 파이프라인을 구축합니다.
        </p>

        {/* Task Checklist Elements */}
        <div className="flex flex-col gap-2 mt-2 bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-outline-variant/30">
          {tasks.map((task) => (
            <label key={task.id} className="flex items-start gap-2.5 cursor-pointer group/item">
              <input
                type="checkbox"
                checked={task.checked}
                onChange={() => toggleTask(task.id)}
                className="mt-1 rounded text-primary focus:ring-primary w-4 h-4 bg-surface-container-high transition-all cursor-pointer"
              />
              <span
                className={`text-sm transition-colors ${
                  task.checked ? "line-through text-outline" : "text-on-surface group-hover/item:text-primary"
                }`}
              >
                {task.text}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Highlight Callout Box */}
      <div className="p-4 rounded-xl bg-surface-container-high text-on-surface flex items-start gap-3 shadow-xs border border-outline-variant/30 transition-all hover:bg-surface-container-highest">
        <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-lg leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            campaign
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-on-surface">💡 엔지니어링 스프린트 중요 안내</span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            AI 스마트 태깅 및 자동 카테고리 제안 모듈은 <strong className="text-on-surface">6월 둘째 주 비공개 베타 릴리즈</strong>로 제공됩니다. QA 엔지니어링 그룹은 5월 28일까지 회귀 테스트 시나리오를 최종 제출해 주시기 바랍니다.
          </p>
        </div>
      </div>

      {/* Section 2: Priority Feature Matrix Table */}
      <div className="flex flex-col gap-3 group mt-4" id="section-matrix">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-on-surface tracking-tight">2. 우선순위 기능 매트릭스 (Feature Matrix)</h2>
          <span className="opacity-0 group-hover:opacity-100 text-outline hover:text-on-surface cursor-pointer text-xs font-mono transition-opacity">
            #matrix
          </span>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          각 기능의 사용자 가치와 개발 공수 난이도를 수치화하여 배포 사이클을 3단계로 분할 관리합니다.
        </p>

        {/* Clean Borderless Elevated Data Table */}
        <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/30">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-surface-container text-on-surface font-semibold border-b border-outline-variant/20">
                <th className="py-3 px-4">기능명 (Feature)</th>
                <th className="py-3 px-4">담당 팀</th>
                <th className="py-3 px-4">릴리즈 일정</th>
                <th className="py-3 px-4">진행 상태</th>
                <th className="py-3 px-4">우선순위</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 font-medium text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">psychology</span>
                  문맥 기반 스마트 제안
                </td>
                <td className="py-3 px-4 text-on-surface-variant">코어 AI팀</td>
                <td className="py-3 px-4 font-mono text-on-surface">2025. 06. 10</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    개발 중 (65%)
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold">
                    P0 (최우선)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 font-medium text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-secondary">sync_alt</span>
                  CRDT 멀티플레이어 협업
                </td>
                <td className="py-3 px-4 text-on-surface-variant">플랫폼 엔진팀</td>
                <td className="py-3 px-4 font-mono text-on-surface">2025. 06. 24</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    아키텍처 검토
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold">
                    P0 (최우선)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-3 px-4 font-medium text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-tertiary">polyline</span>
                  노트 그래프 3D 시각화
                </td>
                <td className="py-3 px-4 text-on-surface-variant">프론트엔드 비주얼팀</td>
                <td className="py-3 px-4 font-mono text-on-surface">2025. 07. 15</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                    기획 대기
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[11px] font-medium">
                    P2 (보통)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Technical Integration Code Block */}
      <div className="flex flex-col gap-3 group mt-4" id="section-api">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-on-surface tracking-tight">3. Noteflow AI SDK 연동 인터페이스</h2>
          <span className="opacity-0 group-hover:opacity-100 text-outline hover:text-on-surface cursor-pointer text-xs font-mono transition-opacity">
            #sdk-spec
          </span>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          클라이언트 에디터 내에서 실시간 마크다운 스트리밍을 파싱하고 자동 액션 아이템을 추출하기 위한 표준 핸들러 스펙입니다:
        </p>

        <CodeBlock
          filename="noteflow-agent-client.ts"
          code={`import { NoteflowSession, AIStreamParser } from '@noteflow/core';\n\n// 1. 비동기 실시간 문맥 세션 초기화\nexport const initializeAISummaryStream = async (noteId: string) => {\n  const session = await NoteflowSession.connect({\n    endpoint: 'wss://api.noteflow.io/v2/stream',\n    authMode: 'workspace_bearer',\n  });\n\n  return session.subscribe(noteId, {\n    onTokenChunk: (delta) => editor.appendGhostText(delta),\n    onComplete: (metadata) => telemetry.recordSyncSuccess(metadata),\n  });\n};`}
        />
      </div>

      {/* Slash Command Input Trigger Bar (Inline Prompt) */}
      <div className="mt-6 p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant flex items-center justify-between cursor-text transition-all group shadow-xs border border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-primary animate-pulse">terminal</span>
          <span className="text-xs group-hover:text-on-surface">
            명령어를 입력하려면 <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest font-mono text-xs text-on-surface shadow-xs border border-outline-variant/20">/</kbd> 키를 누르세요 (AI 작성, 표, 체크리스트, 코드 블록...)
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-xs text-outline">최근 사용: </span>
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono text-xs">/table</span>
          <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-mono text-xs">/ai-action</span>
        </div>
      </div>
    </main>
  );
};
