"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Trophy,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Operacional", href: "/operacional", icon: TrendingUp },
  { label: "Ranking", href: "/ranking", icon: Trophy },
  { label: "Projeções", href: "/projecoes", icon: CalendarDays },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 flex flex-col
                 bg-graphite-950 border-r border-graphite-700"
      style={{ width: "var(--sidebar-width)" }}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-graphite-700">
        <div className="relative h-9 w-9 flex items-center justify-center">
          <svg viewBox="0 0 36 36" className="h-9 w-9">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#2D323D" strokeWidth="1" />
            <circle cx="18" cy="18" r="11" fill="none" stroke="#2D323D" strokeWidth="1" />
            <circle cx="18" cy="18" r="6" fill="none" stroke="#2D323D" strokeWidth="1" />
            <path
              d="M 18 18 L 34 18 A 16 16 0 0 0 18 2 Z"
              fill="rgba(255, 153, 51, 0.12)"
              className="origin-center animate-radar-sweep"
            />
            <line x1="18" y1="8" x2="18" y2="28" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="18" x2="28" y2="18" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="18" cy="18" r="2" fill="#FF9933" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-graphite-100 leading-tight">
            Radar Equatorial
          </p>
          <p className="text-[11px] text-graphite-400 leading-tight">
            Regional Equatorial
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("eq-nav-item", isActive && "eq-nav-item-active")}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1
                             rounded-r-full bg-equatorial-orange"
                />
              )}
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-graphite-700">
        <p className="text-[11px] text-graphite-500">
          QIA Operacional • V1.0
        </p>
        <p className="text-[11px] text-graphite-600 mt-0.5">
          © 2026 Regional Equatorial
        </p>
      </div>
    </aside>
  );
}