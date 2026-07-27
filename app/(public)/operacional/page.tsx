"use client";
import { useState, useMemo } from "react";
import { useDashboardData } from "@/lib/hooks/use-dashboard";
import { useFiltros } from "@/lib/hooks/use-filtros";
import { FiltroPainel } from "@/components/filtros/filtro-painel";
import { Card, CardContent } from "@/components/ui/card";
import {
  cn,
  STATUS_CONFIG,
  formatNumber,
  formatPercent,
} from "@/lib/utils";
import type { DashboardFranquia } from "@/lib/types";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Search,
  ChevronDown,
} from "lucide-react";

type Agrupamento = "grupo" | "estado" | "status" | "lista";

export default function OperacionalPage() {
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
  const [agrupamento, setAgrupamento] = useState<Agrupamento>("lista");
  const [busca, setBusca] = useState("");

  const filtradosPorBusca = useMemo(() => {
    if (!busca) return franquias ?? [];
    const term = busca.toLowerCase().trim();
    return (franquias ?? []).filter(
      (f) =>
        f.franquia.toLowerCase().includes(term) ||
        f.estado.toLowerCase().includes(term) ||
        f.grupo.toLowerCase().includes(term)
    );
  }, [franquias, busca]);

  const grupos = useMemo(() => {
    const dados = filtradosPorBusca.filter(
      (f) => f.status !== "sem_meta" && f.status !== "sem_dados"
    );
    if (agrupamento === "lista") return [{ chave: "Todas", itens: dados }];
    const mapa = new Map<string, DashboardFranquia[]>();
    dados.forEach((f) => {
      const chave =
        agrupamento === "status"
          ? f.status
          : agrupamento === "grupo"
          ? f.grupo
          : f.estado;
      if (!mapa.has(chave)) mapa.set(chave, []);
      mapa.get(chave)!.push(f);
    });
    return Array.from(mapa.entries())
      .map(([chave, itens]) => ({ chave, itens }))
      .sort((a, b) => {
        if (agrupamento === "status") {
          const ordem = ["no_ritmo", "atencao", "risco"];
          return ordem.indexOf(a.chave) - ordem.indexOf(b.chave);
        }
        return a.chave.localeCompare(b.chave);
      });
  }, [filtradosPorBusca, agrupamento]);

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

  const selectClass =
    "bg-graphite-800 border border-graphite-700 rounded-lg px-3 py-2 text-sm text-graphite-100 " +
    "focus:outline-none focus:ring-1 focus:ring-equatorial-orange transition-colors cursor-pointer appearance-none";

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

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite-500" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por franquia, estado ou grupo..."
            className="eq-input pl-9"
          />
        </div>
        <div className="relative">
          <select
            value={agrupamento}
            onChange={(e) => setAgrupamento(e.target.value as Agrupamento)}
            className={selectClass + " pr-8"}
          >
            <option value="lista">Lista simples</option>
            <option value="grupo">Agrupar por grupo</option>
            <option value="estado">Agrupar por estado</option>
            <option value="status">Agrupar por status</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-graphite-500 pointer-events-none" />
        </div>
      </div>

      {isLoading ? (
        <Card className="p-6">
          <div className="flex items-center justify-center py-12">
            <TrendingUp className="h-5 w-5 text-graphite-500 animate-pulse" />
          </div>
        </Card>
      ) : grupos.length === 0 ? (
        <Card className="p-6">
          <div className="text-center py-8">
            <p className="text-sm text-graphite-500">
              Nenhuma franquia encontrada com os filtros atuais.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {grupos.map((grupo) => {
            const config =
              grupo.chave !== "Todas"
                ? STATUS_CONFIG[grupo.chave as keyof typeof STATUS_CONFIG]
                : null;
            const metaTotal = grupo.itens.reduce((s, f) => s + f.meta_operacional, 0);
            const producaoTotal = grupo.itens.reduce((s, f) => s + f.producao_acumulada, 0);
            const projecaoTotal = grupo.itens.reduce((s, f) => s + f.projecao, 0);
            const pctProj = metaTotal > 0 ? (projecaoTotal / metaTotal) * 100 : 0;
            return (
              <div key={grupo.chave} className="space-y-3">
                {agrupamento !== "lista" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {config && (
                        <span className={config.badgeClass}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
                          {config.label}
                        </span>
                      )}
                      {!config && (
                        <h3 className="text-sm font-semibold text-graphite-100 uppercase tracking-wider">
                          {grupo.chave}
                        </h3>
                      )}
                      <span className="text-xs text-graphite-500">
                        ({grupo.itens.length} franquias)
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-graphite-400">
                        Meta: <strong className="text-graphite-200">{formatNumber(metaTotal)}</strong>
                      </span>
                      <span className="text-graphite-400">
                        Produção: <strong className="text-graphite-200">{formatNumber(producaoTotal)}</strong>
                      </span>
                      <span className="text-graphite-400">
                        Projeção:{" "}
                        <strong
                          style={{ color: pctProj >= 98 ? "#10B981" : pctProj >= 85 ? "#F59E0B" : "#EF4444" }}
                        >
                          {formatPercent(pctProj)}
                        </strong>
                        <span className="text-graphite-500 ml-1">
                          ({formatNumber(projecaoTotal)} QIAS)
                        </span>
                      </span>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {grupo.itens.map((f) => (
                    <FranquiaCard key={f.franquia_id} franquia={f} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FranquiaCard({ franquia }: { franquia: DashboardFranquia }) {
  const config = STATUS_CONFIG[franquia.status as keyof typeof STATUS_CONFIG];
  const diferenca = franquia.media_diaria_realizada - franquia.media_diaria_necessaria;
  const DifIcon = diferenca >= 0 ? TrendingUp : diferenca < 0 ? TrendingDown : Minus;
  const difColor = diferenca >= 0 ? "text-status-success" : "text-status-danger";

  return (
    <Card className="p-4 hover:border-graphite-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-graphite-100">
            {franquia.franquia}
          </h4>
          <p className="text-xs text-graphite-500">
            {franquia.estado} • {franquia.grupo}
          </p>
        </div>
        <span className={config?.badgeClass}>
          <span className={cn("h-1.5 w-1.5 rounded-full", config?.dotColor)} />
          {config?.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-graphite-500 uppercase tracking-wider">Meta</p>
          <p className="text-base font-bold text-graphite-100">
            {formatNumber(franquia.meta_operacional)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-graphite-500 uppercase tracking-wider">Produção</p>
          <p className="text-base font-bold text-equatorial-green">
            {formatNumber(franquia.producao_acumulada)}
          </p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] text-graphite-500 mb-1">
          <span>Atingido: {formatPercent(franquia.percentual_atingido)}</span>
          <span>
            Projeção: {formatPercent(franquia.percentual_projecao)}
            <span className="text-graphite-400 ml-1">
              ({formatNumber(franquia.projecao)} QIAS)
            </span>
          </span>
        </div>
        <div className="relative h-2 bg-graphite-800 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-equatorial-orange to-equatorial-orange_soft"
            style={{ width: `${Math.min(franquia.percentual_atingido, 100)}%` }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-white/60"
            style={{ left: `${Math.min(franquia.percentual_projecao, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-graphite-700">
        <div className="text-xs">
          <span className="text-graphite-500">Necessário: </span>
          <span className="font-semibold text-graphite-200">
            {formatNumber(Math.round(franquia.media_diaria_necessaria))}/dia
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <DifIcon className={cn("h-3 w-3", difColor)} />
          <span className={difColor}>
            {diferenca >= 0 ? "+" : ""}
            {formatNumber(Math.abs(Math.round(diferenca)))}
          </span>
        </div>
      </div>
    </Card>
  );
}