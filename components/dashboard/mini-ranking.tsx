"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { STATUS_CONFIG, formatNumber, formatPercent, cn } from "@/lib/utils";
import type { DashboardFranquia } from "@/lib/types";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";

interface MiniRankingProps {
  franquias: DashboardFranquia[];
  isLoading?: boolean;
}

export function MiniRanking({ franquias, isLoading }: MiniRankingProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-equatorial-orange" />
            Ranking de Franquias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 text-graphite-500 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...franquias]
    .filter((f) => f.status !== "sem_meta" && f.status !== "sem_dados")
    .sort((a, b) => b.percentual_projecao - a.percentual_projecao)
    .slice(0, 5);

  const medalhas = ["text-yellow-400", "text-gray-300", "text-amber-700"];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-equatorial-orange" />
          Ranking de Franquias
        </CardTitle>
        <span className="text-xs text-graphite-400">
          Top {sorted.length} de {franquias.length}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-[36px_1fr_50px_70px_90px_80px] gap-2 text-[10px] font-medium text-graphite-400 uppercase tracking-wider px-2 pb-2 border-b border-graphite-700">
            <span>#</span>
            <span>Franquia</span>
            <span>UF</span>
            <span className="text-right">Meta</span>
            <span className="text-right">Proj.</span>
            <span className="text-center">Status</span>
          </div>

          {sorted.map((item, idx) => {
            const pos = idx + 1;
            const status = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
            const MedalhaIcon = pos <= 3 ? (pos === 1 ? Medal : Award) : null;

            return (
              <div
                key={item.franquia_id}
                className="grid grid-cols-[36px_1fr_50px_70px_90px_80px] gap-2 items-center px-2 py-2 rounded-lg hover:bg-graphite-800 transition-colors"
              >
                <div className="flex items-center">
                  {MedalhaIcon ? (
                    <MedalhaIcon className={cn("h-4 w-4", medalhas[pos - 1])} />
                  ) : (
                    <span className="text-sm font-bold text-graphite-400 w-4 text-center">
                      {pos}
                    </span>
                  )}
                </div>

                <span className="text-sm font-medium text-graphite-100 truncate">
                  {item.franquia}
                </span>
                <span className="text-xs text-graphite-400">{item.estado}</span>
                <span className="text-sm text-graphite-300 text-right">
                  {formatNumber(item.meta_operacional)}
                </span>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-graphite-100">
                    {formatPercent(item.percentual_projecao)}
                  </span>
                  <span className="text-[10px] text-graphite-500">
                    {formatNumber(item.projecao)} QIAS
                  </span>
                  <div className="w-full h-1.5 bg-graphite-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(item.percentual_projecao, 100)}%`,
                        backgroundColor: status?.corHex,
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <span className={status?.badgeClass}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", status?.dotColor)} />
                    {status?.label}
                  </span>
                </div>
              </div>
            );
          })}

          {sorted.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-graphite-500">
                Sem dados de produção para exibir.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}