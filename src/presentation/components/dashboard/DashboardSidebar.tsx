"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "../common/BrandLogo";
import { useAuth } from "@/src/presentation/hooks/useAuth";

interface DashboardSidebarProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentTab,
  onTabChange,
}) => {
  const pathname = usePathname() || "";
  const { currentUser, switchUser } = useAuth();

  // 현재 활성 탭 판별: props로 전달된 currentTab이 우선, 없으면 pathname 기반
  const isDashboardActive = currentTab ? currentTab === "dashboard" : pathname === "/dashboard";
  const isNotesActive = currentTab ? currentTab === "notes" : pathname.startsWith("/notes");

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between py-4 border-r border-outline-variant/30">
      <div className="flex flex-col gap-3 px-3">
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between px-2 py-1">
          <BrandLogo size="sm" href="/" />
          <button
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors cursor-pointer"
            title="사이드바 접기"
            type="button"
          >
            <span className="material-symbols-outlined text-lg leading-none">dock_to_left</span>
          </button>
        </div>

        {/* Workspace selector */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/20">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="material-symbols-outlined text-base text-primary">folder_supervised</span>
            <span className="text-xs font-semibold text-on-surface truncate">개인 워크스페이스</span>
          </div>
          <span className="material-symbols-outlined text-base text-on-surface-variant">unfold_more</span>
        </div>

        {/* Quick find */}
        <div className="relative px-1">
          <div className="flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">search</span>
              <span className="text-xs">빠른 검색 (Quick Find)</span>
            </div>
            <kbd className="font-mono text-[11px] bg-surface-container-lowest px-1.5 py-0.5 rounded shadow-xs text-on-surface-variant border border-outline-variant/20">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex flex-col gap-1 mt-2">
          <Link
            href="/dashboard"
            onClick={() => onTabChange?.("dashboard")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left cursor-pointer ${
              isDashboardActive
                ? "bg-primary-container text-on-primary font-bold shadow-xs"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-xl leading-none">dashboard</span>
            <span className="text-xs font-medium">대시보드</span>
          </Link>
          <Link
            href="/notes"
            onClick={() => onTabChange?.("notes")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left cursor-pointer ${
              isNotesActive
                ? "bg-primary-container text-on-primary font-bold shadow-xs"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-xl leading-none">description</span>
            <span className="text-xs font-medium">노트 관리</span>
          </Link>
          <button
            onClick={() => onTabChange?.("quick-notes")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl leading-none">bolt</span>
            <span className="text-xs font-medium">빠른 메모</span>
          </button>
          <button
            onClick={() => onTabChange?.("favorites")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl leading-none">star</span>
            <span className="text-xs font-medium">즐겨찾기</span>
          </button>
          <button
            onClick={() => onTabChange?.("templates")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl leading-none">category</span>
            <span className="text-xs font-medium">템플릿</span>
          </button>
          <button
            onClick={() => onTabChange?.("trash")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all text-left cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl leading-none">delete</span>
            <span className="text-xs font-medium">휴지통</span>
          </button>
        </nav>
      </div>

      {/* Bottom Storage & User Profile */}
      <div className="flex flex-col gap-3 px-3 pt-3 bg-surface-container-lowest">
        <div className="p-3 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">클라우드 스토리지</span>
            <span className="font-semibold text-primary">4.2GB / 15GB</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: "28%" }}></div>
          </div>
          <Link
            href="/payment"
            className="mt-1 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-medium transition-all shadow-xs"
          >
            <span>Pro 업그레이드</span>
            <span className="material-symbols-outlined text-sm leading-none">arrow_forward</span>
          </Link>
        </div>

        {/* User Profile & Account Switcher */}
        <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-surface-container-low border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-xs ${
                  currentUser?.plan === "PRO"
                    ? "bg-gradient-to-tr from-amber-500 to-primary"
                    : "bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                {currentUser?.avatarText || "T1"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-on-surface leading-tight truncate">
                  {currentUser?.name || "테스터"}
                </span>
                <span className="text-[10px] text-on-surface-variant font-mono truncate">
                  {currentUser?.email || "test1@test.com"}
                </span>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                currentUser?.plan === "PRO"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {currentUser?.plan || "FREE"}
            </span>
          </div>

          {/* Test Account Quick Switcher */}
          <div className="flex items-center gap-1 pt-1 border-t border-outline-variant/10 text-[10px]">
            <span className="text-on-surface-variant font-medium shrink-0">계정 전환:</span>
            <button
              type="button"
              onClick={() => switchUser("test1@test.com")}
              className={`flex-1 py-1 px-1.5 rounded transition-all font-mono font-medium ${
                currentUser?.email === "test1@test.com"
                  ? "bg-surface-container-highest text-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              title="회원가입만 한 사용자 (FREE, 미결제)"
            >
              test1 (무료)
            </button>
            <button
              type="button"
              onClick={() => switchUser("test2@test.com")}
              className={`flex-1 py-1 px-1.5 rounded transition-all font-mono font-medium ${
                currentUser?.email === "test2@test.com"
                  ? "bg-primary text-on-primary font-bold shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
              title="회원가입 후 결제 완료한 사용자 (PRO)"
            >
              test2 (유료)
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
