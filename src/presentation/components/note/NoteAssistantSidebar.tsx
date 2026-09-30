import React, { useState } from "react";

export const NoteAssistantSidebar: React.FC = () => {
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handlePromptAction = (type: string) => {
    if (type === "summary") {
      setAiResponse("AI 요약: 비정형 텍스트 자율 분석, 실시간 CRDT 무충돌 동기화, 6월 둘째 주 비공개 베타 릴리즈 예정.");
    } else if (type === "action") {
      setAiResponse("추출된 액션: 1. 5월 28일까지 QA 시나리오 제출 2. SLM 문맥 자동완성 엔트리포인트 검토.");
    } else if (type === "translate") {
      setAiResponse("번역 완료: '2025 H1 Smart Cloud Note Feature Roadmap with Context-Aware AI'");
    }
  };

  const handleSendPrompt = () => {
    if (aiPrompt.trim()) {
      setAiResponse(`Noteflow AI 응답: "${aiPrompt}"에 대한 문맥 분석을 완료했습니다.`);
      setAiPrompt("");
    }
  };

  return (
    <aside className="w-80 shrink-0 hidden xl:flex flex-col gap-6 sticky top-20 self-start h-[calc(100vh-6rem)] overflow-y-auto pr-1">
      {/* 1. Noteflow AI Interactive Agent Card */}
      <div className="flex flex-col p-4 rounded-2xl bg-surface-container-lowest shadow-sm relative overflow-hidden border border-outline-variant/30">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-base leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <span className="text-sm font-bold text-on-surface">Noteflow AI</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary text-xs font-semibold">
            Pro v3
          </span>
        </div>
        <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
          현재 문서의 문맥을 실시간으로 파악하여 생산성을 높이는 스마트 어시스턴트입니다.
        </p>

        {/* Prompt Action Chips */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handlePromptAction("summary")}
            className="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-all flex items-center justify-between group active:scale-98 cursor-pointer border border-outline-variant/10"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-base text-primary leading-none">summarize</span>
              <span className="text-xs font-medium truncate">이 문서 3줄 요약</span>
            </div>
            <span className="material-symbols-outlined text-xs text-outline group-hover:text-primary transition-colors">
              arrow_forward
            </span>
          </button>
          <button
            onClick={() => handlePromptAction("action")}
            className="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-all flex items-center justify-between group active:scale-98 cursor-pointer border border-outline-variant/10"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-base text-secondary leading-none">task_alt</span>
              <span className="text-xs font-medium truncate">회의록 액션 아이템 추출</span>
            </div>
            <span className="material-symbols-outlined text-xs text-outline group-hover:text-secondary transition-colors">
              arrow_forward
            </span>
          </button>
          <button
            onClick={() => handlePromptAction("translate")}
            className="w-full text-left p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-all flex items-center justify-between group active:scale-98 cursor-pointer border border-outline-variant/10"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-base text-tertiary leading-none">translate</span>
              <span className="text-xs font-medium truncate">글로벌 영문 문서로 번역</span>
            </div>
            <span className="material-symbols-outlined text-xs text-outline group-hover:text-tertiary transition-colors">
              arrow_forward
            </span>
          </button>
        </div>

        {/* AI Response Display if available */}
        {aiResponse && (
          <div className="mt-3 p-3 rounded-xl bg-surface-container text-xs text-on-surface border border-outline-variant/30 leading-relaxed animate-fade-in">
            {aiResponse}
          </div>
        )}

        {/* Quick AI Prompt Input */}
        <div className="mt-4 pt-3 flex items-center gap-2 border-t border-outline-variant/20">
          <div className="relative flex-1">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendPrompt()}
              placeholder="AI에게 질문이나 지시하기..."
              className="w-full px-3 py-2 text-xs rounded-lg bg-surface-container text-on-surface placeholder:text-outline outline-none focus:bg-surface-container-high transition-colors border border-outline-variant/20"
            />
          </div>
          <button
            onClick={handleSendPrompt}
            className="p-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors shrink-0 shadow-xs cursor-pointer"
            title="질문 전송"
          >
            <span className="material-symbols-outlined text-sm leading-none">send</span>
          </button>
        </div>
      </div>

      {/* 2. Table of Contents (Outline Navigation) */}
      <div className="flex flex-col p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-3 text-on-surface">
          <div className="flex items-center gap-2 font-semibold text-xs">
            <span className="material-symbols-outlined text-base leading-none text-outline">format_list_bulleted</span>
            <span>문서 목차 (Outline)</span>
          </div>
          <span className="font-mono text-xs text-outline">3개 항목</span>
        </div>
        <nav className="flex flex-col gap-1 text-xs">
          <a
            href="#section-core"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-primary-fixed text-primary font-medium transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="truncate">1. 핵심 개발 목표 (Core Objectives)</span>
          </a>
          <a
            href="#section-matrix"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            <span className="truncate">2. 우선순위 기능 매트릭스</span>
          </a>
          <a
            href="#section-api"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
            <span className="truncate">3. Noteflow AI SDK 연동</span>
          </a>
        </nav>
      </div>

      {/* 3. Document Metadata Quick Stats */}
      <div className="flex flex-col p-4 rounded-2xl bg-surface-container-low text-on-surface-variant text-xs gap-2 border border-outline-variant/20">
        <div className="flex items-center justify-between">
          <span>총 글자 수 (Characters)</span>
          <span className="font-mono text-on-surface font-semibold">1,482자</span>
        </div>
        <div className="flex items-center justify-between">
          <span>예상 소요 읽기 시간</span>
          <span className="font-mono text-on-surface font-semibold">2분 15초</span>
        </div>
        <div className="flex items-center justify-between">
          <span>참여 기여자</span>
          <span className="font-mono text-on-surface font-semibold">4명</span>
        </div>
      </div>
    </aside>
  );
};
