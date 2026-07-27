import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`.replace(".", ",");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export type StatusClassificacao = "no_ritmo" | "atencao" | "risco" | "sem_meta" | "sem_dados";

export function classificarProjecao(percentualProjecao: number): StatusClassificacao {
  if (percentualProjecao >= 98) return "no_ritmo";
  if (percentualProjecao >= 85) return "atencao";
  return "risco";
}

export const STATUS_CONFIG: Record<
  StatusClassificacao,
  { label: string; badgeClass: string; dotColor: string; corHex: string }
> = {
  no_ritmo: {
    label: "No ritmo",
    badgeClass: "eq-badge-success",
    dotColor: "bg-status-success",
    corHex: "#10B981",
  },
  atencao: {
    label: "Atenção",
    badgeClass: "eq-badge-warning",
    dotColor: "bg-status-warning",
    corHex: "#F59E0B",
  },
  risco: {
    label: "Risco",
    badgeClass: "eq-badge-danger",
    dotColor: "bg-status-danger",
    corHex: "#EF4444",
  },
  sem_meta: {
    label: "Sem meta",
    badgeClass: "eq-badge bg-graphite-800 text-graphite-300 border border-graphite-700",
    dotColor: "bg-graphite-500",
    corHex: "#6B7280",
  },
  sem_dados: {
    label: "Sem dados",
    badgeClass: "eq-badge bg-graphite-800 text-graphite-300 border border-graphite-700",
    dotColor: "bg-graphite-500",
    corHex: "#6B7280",
  },
};