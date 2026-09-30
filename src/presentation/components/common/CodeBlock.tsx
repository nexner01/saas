"use client";

import React, { useState } from "react";

interface CodeBlockProps {
  filename?: string;
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  filename,
  code,
  language = "typescript",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      }
    } catch {
      // fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-xl border border-white/10 bg-[#070A11] overflow-hidden my-4 shadow-xl ${className}`}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-surface-dark/90 border-b border-white/5 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          {filename && <span className="font-mono ml-2 text-gray-300 font-medium">{filename}</span>}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          title="코드 복사"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded cursor-pointer"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="p-4 text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};
