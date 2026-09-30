import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = "md",
  showText = true,
  href = "/",
  className = "",
}) => {
  const iconSizes = {
    sm: "w-6 h-6 text-[16px]",
    md: "w-8 h-8 text-[20px]",
    lg: "w-10 h-10 text-[24px]",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const content = (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      <div
        className={`${iconSizes[size]} rounded-lg bg-primary flex items-center justify-center text-white shadow-sm ring-1 ring-white/10`}
      >
        <span className="material-symbols-outlined text-inherit leading-none">hub</span>
      </div>
      {showText && <span className={`${textSizes[size]} font-bold tracking-tight text-on-surface`}>Noteflow</span>}
    </div>
  );

  if (href) {
    return <Link href={href} className="inline-flex items-center focus:outline-none">{content}</Link>;
  }

  return content;
};
