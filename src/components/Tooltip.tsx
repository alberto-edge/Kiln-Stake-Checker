"use client";

import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <span className="relative inline-flex items-center ml-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-muted/30 text-muted hover:bg-muted/50 hover:text-foreground transition-colors cursor-help"
        aria-label="More info"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
          <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="7" fontWeight="bold">?</text>
        </svg>
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 rounded-lg bg-foreground text-background text-xs leading-relaxed px-3 py-2 shadow-lg pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="w-2 h-2 bg-foreground rotate-45" />
          </div>
        </div>
      )}
    </span>
  );
}
