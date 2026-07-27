"use client";

import { useDashboardData } from "@/lib/hooks/use-dashboard";
import { useFiltros } from "@/lib/hooks/use-filtros";
import { consolidarDashboard, gerarResumoExecutivo } from "@/lib/calculations/consolidar";
import { FiltroPainel } from "@/components/filtros/filtro-painel";
import { CardIndicador } from "@/components/dashboard/card-indicador";
import { VelocimetroProjecao } from "@/components/dashboard/velocimetro-projecao";
import { PlanoRecuperacao } from "@/components/dashboard/plano-recuperacao";
import { ResumoExecutivo } from "@/components/dashboard/resumo-executivo";
import { MiniRanking } from "@/components/dashboard/mini-ranking";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { STATUS_CONFIG, formatNumber, formatPercent, cn } from "@/lib/utils";
import {
  Target,
  TrendingUp,
  Percent,
  CalendarDays,
  Activity,
  Clock,
  AlertCircle,
  Gauge,
  Flag,
} from "lucide-react";

export default function DashboardPage() {
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

  const consolidado = franquias ? consolidarDashboard(franquias) : null;
  const resumoTexto = consolidado ? gerarResumoExecutivo(consolidado) : "";

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-status-danger/20">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-status-danger mx-auto mb-3" />
            <h2 className="text-base font-semibold text-graphite-100 mb-1">
              Erro ao carregar dados
            </h2>
            <p className="text-sm text-graphite-400">
              Não foi possível conectar ao banco de dados. Tente novamente em instantes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusAtual = consolidado?.status ?? "sem_dados";

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

      <ResumoExecutivo
        texto={resumoTexto}
        status={statusAtual}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardIndicador
          label="Objetivo do Mês"
          value={consolidado ? formatNumber(consolidado.meta_total) : "—"}
          suffix="QIAS"
          icon={Target}
          isLoading={isLoading}
        />
        <CardIndicador
          label="Produção Acumulada"
          value={consolidado ? formatNumber(consolidado.producao_acumulada) : "—"}
          suffix="QIAS"
          icon={TrendingUp}
          iconColor="text-equatorial-green"
          valueColor="text-equatorial-green"
          isLoading={isLoading}
        />
        <CardIndicador
          label="% Atingido"
          value={consolidado ? formatPercent(consolidado.percentual_atingido) : "—"}
          icon={Percent}
          iconColor="text-equatorial-orange"
          valueColor="text-equatorial-orange"
          isLoading={isLoading}
        />
        <CardIndicador
          label="Projeção Total"
          value={consolidado ? formatNumber(consolidado.projecao_total) : "—"}
          suffix="QIAS"
          icon={Flag}
          iconColor="text-equatorial-orange"
          valueColor="text-equatorial-orange"
          isLoading={isLoading}
        />
        <CardIndicador
          label="Produção Restante"
          value={consolidado ? formatNumber(consolidado.producao_restante) : "—"}
          suffix="QIAS"
          icon={Target}
          iconColor="text-status-danger"
          valueColor="text-status-danger"
          isLoading={isLoading}
        />
        <CardIndicador
          label="Média Diária"
          value={consolidado ? formatNumber(Math.round(consolidado.media_diaria_realizada)) : "—"}
          suffix="QIAS/dia"
          icon={Activity}
          iconColor="text-equatorial-teal"
          valueColor="text-equatorial-teal"
          isLoading={isLoading}
        />
        <CardIndicador
          label="Dias Úteis Rest."
          value={consolidado ? consolidado.dias_uteis_restantes : "—"}
          suffix="dias"
          icon={CalendarDays}
          isLoading={isLoading}
        />
        <CardIndicador
          label="Dias Úteis Totais"
          value={consolidado ? consolidado.dias_uteis_totais : "—"}
          suffix="dias"
          icon={CalendarDays}
          iconColor="text-graphite-400"
          valueColor="text-graphite-200"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-equatorial-orange" />
              Projeção de Fechamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Activity className="h-5 w-5 text-graphite-500 animate-pulse" />
              </div>
            ) : (
              <>
                <VelocimetroProjecao
                  projecao={consolidado?.percentual_projecao ?? 0}
                  projecaoValor={consolidado?.projecao_total ?? 0}
                  status={statusAtual}
                />
                <div className="text-center mt-6 space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className={STATUS_CONFIG[statusAtual]?.badgeClass}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_CONFIG[statusAtual]?.dotColor)} />
                      {STATUS_CONFIG[statusAtual]?.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-6 text-xs text-graphite-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-status-success" />
                      ≥ 98%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-status-warning" />
                      85-97%
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-status-danger" />
                      &lt; 85%
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <PlanoRecuperacao
          mediaDiariaNecessaria={consolidado?.media_diaria_necessaria ?? 0}
          mediaDiariaRealizada={consolidado?.media_diaria_realizada ?? 0}
          status={statusAtual}
          isLoading={isLoading}
        />

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-equatorial-teal" />
              Ritmo Necessário
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Clock className="h-5 w-5 text-graphite-500 animate-pulse" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-graphite-400 mb-1">Produção restante</p>
                  <p className="text-2xl font-bold text-graphite-100">
                    {formatNumber(consolidado?.producao_restante ?? 0)}
                    <span className="text-sm text-graphite-500 ml-1">QIAS</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-graphite-400 mb-1">Dias úteis restantes</p>
                  <p className="text-2xl font-bold text-graphite-100">
                    {consolidado?.dias_uteis_restantes ?? 0}
                    <span className="text-sm text-graphite-500 ml-1">dias</span>
                  </p>
                </div>
                <div className="pt-3 border-t border-graphite-700">
                  <p className="text-xs text-graphite-400 mb-1">Média necessária por dia</p>
                  <p className="text-3xl font-bold text-equatorial-teal">
                    {formatNumber(Math.round(consolidado?.media_diaria_necessaria ?? 0))}
                    <span className="text-sm text-graphite-500 ml-1">QIAS/dia</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="text-center bg-graphite-800 rounded-lg p-2">
                    <p className="text-[10px] text-graphite-500 uppercase">Decorridos</p>
                    <p className="text-lg font-bold text-graphite-200">
                      {consolidado?.dias_uteis_decorridos ?? 0}
                    </p>
                  </div>
                  <div className="text-center bg-graphite-800 rounded-lg p-2">
                    <p className="text-[10px] text-graphite-500 uppercase">Total no mês</p>
                    <p className="text-lg font-bold text-graphite-200">
                      {consolidado?.dias_uteis_totais ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <MiniRanking franquias={franquias ?? []} isLoading={isLoading} />

      <div className="flex items-center justify-center gap-2 text-xs text-graphite-600 pt-2">
        <Activity className="h-3 w-3" />
        <span>
          Dados de referência: D-1 ({new Date(Date.now() - 86400000).toLocaleDateString("pt-BR")})
          {hasFiltrosAtivos && " • Filtros aplicados"}
        </span>
      </div>
    </div>
  );
}