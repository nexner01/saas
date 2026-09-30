import React from "react";
import Link from "next/link";
import { BrandLogo } from "../common/BrandLogo";

export const LandingHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/30">
      <div className="h-16 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <BrandLogo size="md" href="/" />
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              제품 기능
            </a>
            <a href="#templates" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              템플릿
            </a>
            <Link href="/payment" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              요금제
            </Link>
            <a href="#enterprise" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
              엔터프라이즈
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-3 py-2"
          >
            로그인
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center text-sm font-semibold text-on-primary bg-primary hover:bg-primary-container px-4 py-2 rounded-lg transition-all shadow-[0_1px_4px_rgba(53,37,205,0.25)]"
          >
            무료로 시작하기
          </Link>
        </div>
      </div>
    </header>
  );
};
