import React from "react";
import Link from "next/link";
import { BrandLogo } from "../common/BrandLogo";

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-low py-12 border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" href="/" />
            <span className="text-xs text-on-surface-variant ml-2">
              © 2025 Noteflow Cloud Inc. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">
              기능 소개
            </a>
            <a href="#templates" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">
              템플릿 갤러리
            </a>
            <a href="#pricing" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">
              가격 정책
            </a>
            <a href="#enterprise" className="text-xs text-on-surface-variant hover:text-on-surface transition-colors">
              기업용 솔루션
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
