"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardIndicadorProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  isLoading?: boolean;
}

export function CardIndicador({
  label,
  value,
  suffix,
  icon: Icon,
  iconColor = "text-graphite-500",
  valueColor = "text-graphite-100",
  isLoading,
}: CardIndicadorProps) {
  if (isLoading) {
    return (
      <div className="eq-stat">
        <div className="flex items-center justify-between">
          <span className="eq-stat-label">{label}</span>
          <div className="h-4 w-4 eq-skeleton" />
        </div>
        <div className="h-8 w-24 eq-skeleton" />
      </div>
    );
  }

  return (
    <div className="eq-stat">
      <div className="flex items-center justify-between">
        <span className="eq-stat-label">{label}</span>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={cn("eq-stat-value", valueColor)}>{value}</span>
        {suffix && <span className="text-xs text-graphite-500">{suffix}</span>}
      </div>
    </div>
  );
}