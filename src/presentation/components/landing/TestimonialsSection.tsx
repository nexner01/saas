import React, { useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatarText: string;
}

const testimonials: Testimonial[] = [
  {
    name: "김서연",
    role: "Lead Product Manager · 핀테크 스타트업",
    quote:
      "스프린트 기획 시 백링크 그래프를 띄워두면 미처 고려하지 못했던 기획 누락과 상호 의존성이 한눈에 드러납니다. 팀 미팅 시간이 40% 이상 단축되었어요.",
    avatarText: "KS",
  },
  {
    name: "박준형 박사",
    role: "AI 시스템 수석 연구원 · 테크 연구소",
    quote:
      "수백 편의 논문과 연구 자료를 아카이빙할 때 AI 자동 요약과 문맥 태깅의 도움을 크게 받고 있습니다. 내 생각의 제2의 두뇌(Second Brain)로 완전히 정착했습니다.",
    avatarText: "PJ",
  },
  {
    name: "이도현",
    role: "시니어 풀스택 엔지니어 · 클라우드 인프라 팀",
    quote:
      "오프라인 편집 성능과 마크다운 렌더링 속도가 경이롭습니다. 키보드 숏컷만으로 모든 문서를 제어할 수 있어 코딩 흐름이 전혀 끊기지 않습니다.",
    avatarText: "LD",
  },
];

export const TestimonialsSection: React.FC = () => {
  const [animating, setAnimating] = useState(false);

  const handleNav = () => {
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
    }, 200);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full" id="templates">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs font-bold text-secondary tracking-wider uppercase block mb-2">
            USER STORIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
            일하는 방식을 완전히 바꾼 사람들의 이야기
          </h2>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button
            aria-label="이전 리뷰"
            onClick={handleNav}
            className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <button
            aria-label="다음 리뷰"
            onClick={handleNav}
            className="w-10 h-10 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant/30 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300 ${
          animating ? "opacity-75 translate-y-1" : "opacity-100 translate-y-0"
        }`}
      >
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="bg-surface-container-lowest p-7 rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/30"
          >
            <div>
              <div className="flex text-amber-500 mb-4">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <p className="text-base text-on-surface font-medium leading-snug mb-6">
                &quot;{item.quote}&quot;
              </p>
            </div>
            <div className="flex items-center gap-3.5 pt-4 border-t border-outline-variant/20">
              <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-primary to-secondary text-white font-bold text-sm flex items-center justify-center shadow-sm">
                {item.avatarText}
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface leading-tight">{item.name}</h4>
                <p className="text-xs text-on-surface-variant">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
