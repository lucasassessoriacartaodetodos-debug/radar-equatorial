"use client";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16 flex items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-16 w-16">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#2D323D" strokeWidth="1" />
            <circle cx="18" cy="18" r="11" fill="none" stroke="#2D323D" strokeWidth="1" />
            <circle cx="18" cy="18" r="6" fill="none" stroke="#2D323D" strokeWidth="1" />
            <path
              d="M 18 18 L 34 18 A 16 16 0 0 0 18 2 Z"
              fill="rgba(255, 153, 51, 0.15)"
              className="origin-center animate-radar-sweep"
            />
            <line x1="18" y1="8" x2="18" y2="28" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="18" x2="28" y2="18" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="18" cy="18" r="2" fill="#FF9933" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-graphite-200">Radar Equatorial</p>
          <p className="text-xs text-graphite-500 mt-1">Carregando...</p>
        </div>
      </div>
    </div>
  );
}