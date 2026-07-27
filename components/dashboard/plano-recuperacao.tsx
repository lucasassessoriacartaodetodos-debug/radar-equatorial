"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { STATUS_CONFIG, type StatusClassificacao, formatNumber, cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PlanoRecuperacaoProps {
  mediaDiariaNecessaria: number;
  mediaDiariaRealizada: number;
  status: StatusClassificacao;
  isLoading?: boolean;
}

export function PlanoRecuperacao({
  mediaDiariaNecessaria,
  mediaDiariaRealizada,
  status,
  isLoading,
}: PlanoRecuperacaoProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Plano de Recuperação</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 text-graphite-500 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const diferenca = Math.round(mediaDiariaRealizada - mediaDiariaNecessaria);
  const statusConfig = STATUS_CONFIG[status];
  const diferencaColor = diferenca >= 0 ? "text-status-success" : "text-status-danger";

  return (
    <Card>
      <CardHeader><CardTitle>Plano de Recuperação</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-3 text-xs font-medium text-graphite-400 uppercase tracking-wider pb-2 border-b border-graphite-700">
            <span>Necessário / Dia</span>
            <span>Realizado / Dia</span>
            <span>Diferença</span>
            <span>Situação</span>
          </div>

          <div className="grid grid-cols-4 gap-3 items-center">
            <div>
              <span className="text-lg font-bold text-graphite-100">
                {formatNumber(Math.round(mediaDiariaNecessaria))}
              </span>
              <span className="text-xs text-graphite-500 ml-1">QIAS</span>
            </div>
            <div>
              <span className="text-lg font-bold text-graphite-100">
                {formatNumber(Math.round(mediaDiariaRealizada))}
              </span>
              <span className="text-xs text-graphite-500 ml-1">QIAS</span>
            </div>
            <div>
              <span className={`text-lg font-bold ${diferencaColor}`}>
                {diferenca >= 0 ? "+" : ""}
                {formatNumber(Math.abs(diferenca))}
              </span>
              <span className="text-xs text-graphite-500 ml-1">QIAS</span>
            </div>
            <div>
              <span className={statusConfig.badgeClass}>
                <span className={cn("h-1.5 w-1.5 rounded-full", statusConfig.dotColor)} />
                {statusConfig.label}
              </span>
            </div>
          </div>

          <div className="pt-3">
            <div className="flex items-center justify-between text-[10px] text-graphite-500 mb-1">
              <span>Ritmo atual</span>
              <span>Necessário</span>
            </div>
            <div className="relative h-2 bg-graphite-800 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-status-danger via-status-warning to-status-success"
                style={{ width: "100%" }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-white"
                style={{
                  left: `${Math.min((mediaDiariaRealizada / Math.max(mediaDiariaNecessaria, 1)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}