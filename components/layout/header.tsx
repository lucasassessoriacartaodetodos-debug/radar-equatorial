"use client";

import { usePathname } from "next/navigation";
import { Bell, RefreshCw } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/operacional": "Operacional",
  "/ranking": "Ranking",
  "/projecoes": "Projeções",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Radar Equatorial";

  return (
    <header className="eq-glass sticky top-0 z-30 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-graphite-100">{title}</h1>
        <span className="hidden sm:inline-flex eq-badge bg-graphite-800 text-graphite-300 border border-graphite-700">
          QIA Operacional
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 text-xs text-graphite-400 mr-2">
          <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
          <span>Atualizado há 2h</span>
        </div>

        <button
          className="p-2 rounded-lg text-graphite-400 hover:text-graphite-100
                     hover:bg-graphite-800 transition-colors"
          title="Atualizar dados"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        <button
          className="p-2 rounded-lg text-graphite-400 hover:text-graphite-100
                     hover:bg-graphite-800 transition-colors relative"
          title="Notificações"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-equatorial-orange" />
        </button>
      </div>
    </header>
  );
}