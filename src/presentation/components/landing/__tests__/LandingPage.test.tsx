import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { LandingPage } from "../LandingPage";

describe("LandingPage Component (TDD)", () => {
  it("renders header with logo, navigation links, and CTA", () => {
    render(<LandingPage />);

    expect(screen.getAllByText("Noteflow").length).toBeGreaterThan(0);
    expect(screen.getAllByText("제품 기능").length).toBeGreaterThan(0);
    expect(screen.getAllByText("템플릿").length).toBeGreaterThan(0);
    expect(screen.getAllByText("요금제").length).toBeGreaterThan(0);
    expect(screen.getAllByText("엔터프라이즈").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "무료로 시작하기" })).toBeInTheDocument();
  });

  it("renders hero section with release badge, headline, and dual CTA buttons", () => {
    render(<LandingPage />);

    expect(screen.getByText(/Noteflow 3.0 출시/i)).toBeInTheDocument();
    expect(screen.getByText(/생각이 흐르는 곳,/i)).toBeInTheDocument();
    expect(screen.getByText(/스마트한 클라우드 메모/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /인터랙티브 데모 체험/i })).toBeInTheDocument();
    expect(screen.getByText(/50,000\+ 활성 사용자/i)).toBeInTheDocument();
  });

  it("renders the tri-split interactive workspace visual mock with editor and graph", () => {
    render(<LandingPage />);

    expect(screen.getByText("2025 전략 로드맵")).toBeInTheDocument();
    expect(screen.getByText(/프로덕트 비전 & 지식 메쉬 아키텍처/i)).toBeInTheDocument();
    expect(screen.getByText("지식 백링크 그래프")).toBeInTheDocument();
    expect(screen.getByText("Noteflow AI 자동 요약")).toBeInTheDocument();
    expect(screen.getByText("동료 3명 동시 편집 중")).toBeInTheDocument();
  });

  it("renders 3-column architecture feature cards", () => {
    render(<LandingPage />);

    expect(screen.getByText("실시간 클라우드 동기화")).toBeInTheDocument();
    expect(screen.getByText("스마트 AI 어시스턴트")).toBeInTheDocument();
    expect(screen.getByText("양방향 백링크 & 지식 그래프")).toBeInTheDocument();
    expect(screen.getByText("12ms (동급 최저)")).toBeInTheDocument();
    expect(screen.getByText("2,419 Nodes")).toBeInTheDocument();
  });

  it("renders testimonials with user reviews and navigations", async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    expect(screen.getByText("일하는 방식을 완전히 바꾼 사람들의 이야기")).toBeInTheDocument();
    expect(screen.getByText("김서연")).toBeInTheDocument();
    expect(screen.getByText("박준형 박사")).toBeInTheDocument();
    expect(screen.getByText("이도현")).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: "다음 리뷰" });
    const prevBtn = screen.getByRole("button", { name: "이전 리뷰" });
    await user.click(nextBtn);
    await user.click(prevBtn);
  });

  it("renders bottom CTA section with email input and trial button submission", async () => {
    const user = userEvent.setup();
    render(<LandingPage />);

    expect(screen.getByText("지금 바로 더 스마트한 메모 습관을 시작하세요")).toBeInTheDocument();
    const emailInput = screen.getByPlaceholderText("업무용 이메일 입력");
    await user.type(emailInput, "test@example.com");

    const submitBtn = screen.getByRole("button", { name: "무료 체험 시작" });
    await user.click(submitBtn);
  });

  it("handles interactive demo scroll button click", async () => {
    const user = userEvent.setup();
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(<LandingPage />);
    const demoBtn = screen.getByRole("button", { name: /인터랙티브 데모 체험/i });
    await user.click(demoBtn);

    expect(scrollIntoViewMock).toHaveBeenCalled();
  });
});
