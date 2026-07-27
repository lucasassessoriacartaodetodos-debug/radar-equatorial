"use client";

import { useDashboardData } from "@/lib/hooks/use-dashboard";
import { useFiltros } from "@/lib/hooks/use-filtros";
import { FiltroPainel } from "@/components/filtros/filtro-painel";
import { TabelaRanking } from "@/components/ranking/tabela-ranking";
import { Card, CardContent } from "@/components/ui/card";
import { cn, STATUS_CONFIG, formatNumber, formatPercent } from "@/lib/utils";
import { Trophy, Medal, AlertCircle } from "lucide-react";

export default function RankingPage() {
  const {
    estado,
    grupo,
    franquia,
    setEstado,
    setGrupo,
    setFranquia,
    filtros,
    limparFiltros,
    hasFiltrosAtivos,
  } = useFiltros();

  const { data: franquias, isLoading, isError } = useDashboardData(filtros);

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-status-danger mx-auto mb-3" />
            <p className="text-sm text-graphite-400">
              Erro ao carregar dados. Tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const comDados =
    franquias?.filter((f) => f.status !== "sem_meta" && f.status !== "sem_dados") ?? [];

  const noRitmo = comDados.filter((f) => f.status === "no_ritmo").length;
  const atencao = comDados.filter((f) => f.status === "atencao").length;
  const risco = comDados.filter((f) => f.status === "risco").length;

  const top3 = [...comDados]
    .sort((a, b) => b.percentual_projecao - a.percentual_projecao)
    .slice(0, 3);

  const medalhaCores = [
    { bg: "bg-yellow-400/10", border: "border-yellow-400/20", icon: "text-yellow-400", label: "1 Lugar", corHex: "#facc15" },
    { bg: "bg-gray-300/10", border: "border-gray-300/20", icon: "text-gray-300", label: "2 Lugar", corHex: "#d1d5db" },
    { bg: "bg-amber-700/10", border: "border-amber-700/20", icon: "text-amber-700", label: "3 Lugar", corHex: "#b45309" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">

      <FiltroPainel
        estado={estado}
        grupo={grupo}
        franquia={franquia}
        setEstado={setEstado}
        setGrupo={setGrupo}
        setFranquia={setFranquia}
        onLimpar={limparFiltros}
        hasFiltrosAtivos={hasFiltrosAtivos}
      />

      {top3.length === 3 && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((f, idx) => {
            const m = medalhaCores[idx];
            const MedalhaIcon = idx === 0 ? Trophy : Medal;
            return (
              <Card
                key={f.franquia_id}
                className={cn("border-l-4", m.border, m.bg)}
                style={{ borderLeftColor: m.corHex }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MedalhaIcon className={cn("h-5 w-5", m.icon)} />
                        <span className="text-xs font-medium text-graphite-400 uppercase tracking-wider">
                          {m.label}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-graphite-100">
                        {f.franquia}
                      </h3>
                      <p className="text-xs text-graphite-400">
                        {f.estado} - {f.grupo}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-2xl font-bold block"
                        style={{ color: STATUS_CONFIG[f.status as keyof typeof STATUS_CONFIG]?.corHex }}
                      >
                        {formatPercent(f.percentual_projecao)}
                      </span>
                      <span className="text-xs text-graphite-400">
                        {formatNumber(f.projecao)} QIAS
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-graphite-700">
                    <div>
                      <p className="text-[10px] text-graphite-500 uppercase">Meta</p>
                      <p className="text-sm font-semibold text-graphite-200">
                        {formatNumber(f.meta_operacional)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-graphite-500 uppercase">Producao</p>
                      <p className="text-sm font-semibold text-graphite-200">
                        {formatNumber(f.producao_acumulada)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-graphite-500 uppercase">% Atingido</p>
                      <p className="text-sm font-semibold text-graphite-200">
                        {formatPercent(f.percentual_atingido)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-graphite-500 mb-1">
                      <span>Projecao</span>
                      <span>{formatPercent(f.percentual_projecao)} - {formatNumber(f.projecao)} QIAS</span>
                    </div>
                    <div className="h-2 bg-graphite-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(f.percentual_projecao, 100)}%`,
                          backgroundColor: STATUS_CONFIG[f.status as keyof typeof STATUS_CONFIG]?.corHex,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-4 gap-3">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-graphite-100">{comDados.length}</p>
          <p className="text-xs text-graphite-400 mt-0.5">Total de Franquias</p>
        </Card>
        <Card className="p-4 text-center border-status-success/20">
          <p className="text-2xl font-bold text-status-success">{noRitmo}</p>
          <p className="text-xs text-graphite-400 mt-0.5">No Ritmo</p>
        </Card>
        <Card className="p-4 text-center border-status-warning/20">
          <p className="text-2xl font-bold text-status-warning">{atencao}</p>
          <p className="text-xs text-graphite-400 mt-0.5">Atencao</p>
        </Card>
        <Card className="p-4 text-center border-status-danger/20">
          <p className="text-2xl font-bold text-status-danger">{risco}</p>
          <p className="text-xs text-graphite-400 mt-0.5">Risco</p>
        </Card>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-equatorial-orange" />
          <h2 className="text-sm font-semibold text-graphite-100">
            Ranking Completo
          </h2>
        </div>
        <TabelaRanking data={franquias ?? []} isLoading={isLoading} />
      </div>
    </div>
  );
}