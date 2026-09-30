"use client";

import React, { ReactNode } from "react";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";
import { DashboardHeader } from "../dashboard/DashboardHeader";

export interface AppLayoutProps {
  children: ReactNode;
  currentTab?: string;
  onTabChange?: (tab: string) => void;
  onNewNoteClick?: () => void;
  className?: string;
}

/**
 * AppLayout: 결제 후/로그인 후 워크스페이스 내 모든 비공개 페이지의 기본 레이아웃
 * - 좌측 일관된 사이드바(대시보드, 노트 관리, 즐겨찾기, 템플릿 등)
 * - 상단 일관된 헤더 내비게이션 바(검색, 최근 변경, 새 메모 생성, 프로필)
 * - 메인 컨텐츠 영역
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentTab,
  onTabChange,
  onNewNoteClick,
  className = "",
}) => {
  return (
    <div className={`bg-surface font-sans text-on-surface antialiased min-h-screen ${className}`}>
      {/* 1. Global Left Sidebar */}
      <DashboardSidebar currentTab={currentTab} onTabChange={onTabChange} />

      {/* 2. Main Page Area (Offset by sidebar width 64) */}
      <div className="pl-64">
        {/* Top Navigation Bar Header */}
        <DashboardHeader onNewNoteClick={onNewNoteClick} />

        {/* Dynamic Route Content */}
        <main className="relative pt-16 bg-surface min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};
