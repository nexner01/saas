import React from "react";

interface CloudSyncIndicatorProps {
  status?: "synced" | "syncing" | "offline";
  text?: string;
  className?: string;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  status = "synced",
  text,
  className = "",
}) => {
  const statusConfig = {
    synced: {
      dotColor: "bg-emerald-500",
      pulseColor: "bg-emerald-500/40",
      defaultText: "실시간 동기화 완료",
    },
    syncing: {
      dotColor: "bg-brand-500",
      pulseColor: "bg-brand-500/40 animate-ping",
      defaultText: "동기화 중...",
    },
    offline: {
      dotColor: "bg-gray-500",
      pulseColor: "bg-gray-500/40",
      defaultText: "오프라인 모드",
    },
  };

  const current = statusConfig[status];
  const displayText = text !== undefined ? text : current.defaultText;

  return (
    <div className={`flex items-center gap-2 text-xs text-gray-400 select-none ${className}`}>
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pulseColor}`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dotColor}`} />
      </span>
      {displayText && <span>{displayText}</span>}
    </div>
  );
};
