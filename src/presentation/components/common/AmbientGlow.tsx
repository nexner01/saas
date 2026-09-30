import React from "react";

interface AmbientGlowProps {
  position?: "top-center" | "top-left" | "center";
  className?: string;
}

export const AmbientGlow: React.FC<AmbientGlowProps> = ({
  position = "top-center",
  className = "",
}) => {
  const positionStyles = {
    "top-center": "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px]",
    "top-left": "top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[600px] h-[500px]",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px]",
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 overflow-hidden ${className}`}
    >
      <div
        className={`absolute rounded-full blur-[140px] opacity-25 bg-gradient-to-tr from-brand-600/60 via-accent-indigo/50 to-purple-600/40 ${positionStyles[position]}`}
      />
    </div>
  );
};
