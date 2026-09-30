import React, { ReactNode } from "react";

interface StatusBadgeProps {
  variant?: "primary" | "secondary" | "tertiary" | "success" | "warning" | "error";
  children: ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = "secondary",
  children,
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-brand-500/10 text-brand-400 border-brand-500/30",
    secondary: "bg-white/5 text-gray-400 border-white/10",
    tertiary: "bg-accent-indigo/15 text-indigo-300 border-accent-indigo/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

interface TagChipProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export const TagChip: React.FC<TagChipProps> = ({
  label,
  onRemove,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-dark/80 text-gray-300 border border-white/5 hover:border-white/15 transition-colors ${className}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${label} 삭제`}
          className="text-gray-400 hover:text-white p-0.5 rounded focus:outline-none"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};
