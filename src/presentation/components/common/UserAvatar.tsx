import React from "react";

interface UserAvatarProps {
  name?: string;
  src?: string;
  isLive?: boolean;
  count?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  src,
  isLive = false,
  count,
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return "";
    const trimmed = fullName.trim();
    if (trimmed.length >= 3) {
      return trimmed.slice(1, 3);
    }
    return trimmed;
  };

  if (count !== undefined) {
    return (
      <div
        className={`${sizeMap[size]} rounded-full bg-surface-dark border-2 border-[#0B0F19] flex items-center justify-center font-bold text-gray-400 select-none shadow-sm ${className}`}
      >
        +{count}
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full overflow-hidden border border-white/10 bg-surface-dark flex items-center justify-center font-bold text-gray-200 select-none shadow-md`}
      >
        {src ? (
          <img src={src} alt={name || "사용자 아바타"} className="w-full h-full object-cover" />
        ) : (
          <span>{name ? getInitials(name) : "유저"}</span>
        )}
      </div>

      {isLive && (
        <span
          data-testid="live-indicator"
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0B0F19]"
        />
      )}
    </div>
  );
};
