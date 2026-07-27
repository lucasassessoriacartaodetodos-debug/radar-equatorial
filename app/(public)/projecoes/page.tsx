"use client";

import { useState, useMemo } from "react";
import { useDashboardData } from "@/lib/hooks/use-dashboard";
import { useFiltros } from "@/lib/hooks/use-filtros";
import { FiltroPainel } from "@/components/filtros/filtro-painel";
import { VelocimetroProjecao } from "@/components/dashboard/velocimetro-projecao";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { consolidarDashboard } from "@/lib/calculations/consolidar";
import { cn, STATUS_CONFIG, formatNumber, formatPercent } from "@/lib/utils";
import {
  AlertCircle,
  Target,
  Activity,
  Calendar,
  Gauge,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

type CenarioTipo = "atual" | "otimista" | "pessimista" | "personalizado";

export default function ProjecoesPage() {
  const {
    estado, grupo, franquia, setEstado, setGrupo, setFranquia,
    filtros, limparFiltros, hasFiltrosAtivos,
  } = useFiltros();

  const { data: franquias, isLoading, isError } = useDashboardData(filtros);
  const [cenarioTipo, setCenarioTipo] = useState<CenarioTipo>("atual");
  const [ajustePercentual, setAjustePercentual] = useState(0);

  const consolidado = franquias ? consolidarDashboard(franquias) : null;

  const cenarios = useMemo(() => {
    if (!consolidado) return null;
    const mediaAtual = consolidado.media_diaria_realizada;
    const diasTotais = consolidado.dias_uteis_totais;
    const diasDecorridos = consolidado.dias_uteis_decorridos;
    const meta = consolidado.meta_total;
    if (diasDecorridos === 0 || meta === 0) return null;

    const atual = mediaAtual * diasTotais;
    const otimista = (mediaAtual * 1.1) * diasTotais;
    const pessimista = (mediaAtual * 0.9) * diasTotais;
    const personalizado = (mediaAtual * (1 + ajustePercentual / 100)) * diasTotais;

    return {
      atual: { projecao: Math.round(atual), percentual: (atual / meta) * 100, media: mediaAtual, status: classificar((atual / meta) * 100) },
      otimista: { projecao: Math.round(otimista), percentual: (otimista / meta) * 100, media: mediaAtual * 1.1, status: classificar((otimista / meta) * 100) },
      pessimista: { projecao: Math.round(pessimista), percentual: (pessimista / meta) * 100, media: mediaAtual * 0.9, status: classificar((pessimista / meta) * 100) },
      personalizado: { projecao: Math.round(personalizado), percentual: (personalizado / meta) * 100, media: mediaAtual * (1 + ajustePercentual / 100), status: classificar((personalizado / meta) * 100) },
    };
  }, [consolidado, ajustePercentual]);

  const cenarioAtivo =
    cenarioTipo === "personalizado" ? cenarios?.personalizado :
    cenarioTipo === "otimista" ? cenarios?.otimista :
    cenarioTipo === "pessimista" ? cenarios?.pessimista :
    cenarios?.atual;

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card><CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-status-danger mx-auto mb-3" />
          <p className="text-sm text-graphite-400">Erro ao carregar dados. Tente novamente.</p>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FiltroPainel
        estado={estado} grupo={grupo} franquia={franquia}
        setEstado={setEstado} setGrupo={setGrupo} setFranquia={setFranquia}
        onLimpar={limparFiltros} hasFiltrosAtivos={hasFiltrosAtivos}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-equatorial-orange" />
            Projeção de Fechamento
          </CardTitle></CardHeader>
          <CardContent>
            {isLoading || !cenarioAtivo ? (
              <div className="flex items-center justify-center py-12">
                <Activity className="h-5 w-5 text-graphite-500 animate-pulse" />
              </div>
            ) : (
              <>
                <VelocimetroProjecao projecao={cenarioAtivo.percentual} status={cenarioAtivo.status} size="lg" />
                <div className="text-center mt-4 space-y-3">
                  <div>
                    <p className="text-xs text-graphite-500 uppercase tracking-wider mb-1">Projeção de Fechamento</p>
                    <p className="text-2xl font-bold text-graphite-100">
                      {formatNumber(cenarioAtivo.projecao)}
                      <span className="text-sm text-graphite-500 ml-1">unidades</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className={STATUS_CONFIG[cenarioAtivo.status as keyof typeof STATUS_CONFIG]?.badgeClass}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_CONFIG[cenarioAtivo.status as keyof typeof STATUS_CONFIG]?.dotColor)} />
                      {STATUS_CONFIG[cenarioAtivo.status as keyof typeof STATUS_CONFIG]?.label}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4 text-equatorial-teal" />
            Análise de Cenários
          </CardTitle></CardHeader>
          <CardContent>
            {isLoading || !cenarios ? (
              <div className="flex items-center justify-center py-12">
                <Activity className="h-5 w-5 text-graphite-500 animate-pulse" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <CenarioBotao label="Atual" sublabel="Manter ritmo" icon={Minus} active={cenarioTipo === "atual"} onClick={() => setCenarioTipo("atual")} status={cenarios.atual.status} />
                  <CenarioBotao label="Otimista" sublabel="+10% ritmo" icon={ArrowUp} active={cenarioTipo === "otimista"} onClick={() => setCenarioTipo("otimista")} status={cenarios.otimista.status} />
                  <CenarioBotao label="Pessimista" sublabel="-10% ritmo" icon={ArrowDown} active={cenarioTipo === "pessimista"} onClick={() => setCenarioTipo("pessimista")} status={cenarios.pessimista.status} />
                  <CenarioBotao label="Personalizado" sublabel={`${ajustePercentual > 0 ? "+" : ""}${ajustePercentual}% ritmo`} icon={Gauge} active={cenarioTipo === "personalizado"} onClick={() => setCenarioTipo("personalizado")} status={cenarios.personalizado.status} />
                </div>

                {cenarioTipo === "personalizado" && (
                  <div className="eq-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-graphite-400 uppercase tracking-wider">Ajuste de Ritmo</span>
                      <span className={cn("text-sm font-bold", ajustePercentual > 0 ? "text-status-success" : ajustePercentual < 0 ? "text-status-danger" : "text-graphite-100")}>
                        {ajustePercentual > 0 ? "+" : ""}{ajustePercentual}%
                      </span>
                    </div>
                    <input type="range" min={-30} max={30} step={5} value={ajustePercentual} onChange={(e) => setAjustePercentual(Number(e.target.value))} className="w-full accent-equatorial-orange" />
                    <div className="flex justify-between text-[10px] text-graphite-500 mt-1">
                      <span>-30%</span><span>0%</span><span>+30%</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <CenarioCard label="Cenário Atual" projecao={cenarios.atual.projecao} percentual={cenarios.atual.percentual} status={cenarios.atual.status} media={cenarios.atual.media} highlighted={cenarioTipo === "atual"} />
                  <CenarioCard label="Otimista (+10%)" projecao={cenarios.otimista.projecao} percentual={cenarios.otimista.percentual} status={cenarios.otimista.status} media={cenarios.otimista.media} highlighted={cenarioTipo === "otimista"} />
                  <CenarioCard label="Pessimista (-10%)" projecao={cenarios.pessimista.projecao} percentual={cenarios.pessimista.percentual} status={cenarios.pessimista.status} media={cenarios.pessimista.media} highlighted={cenarioTipo === "pessimista"} />
                  <CenarioCard label={`Personalizado (${ajustePercentual > 0 ? "+" : ""}${ajustePercentual}%)`} projecao={cenarios.personalizado.projecao} percentual={cenarios.personalizado.percentual} status={cenarios.personalizado.status} media={cenarios.personalizado.media} highlighted={cenarioTipo === "personalizado"} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {consolidado && !isLoading && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-graphite-500" />
            Base de Cálculo
          </CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-graphite-500 uppercase tracking-wider mb-1">Meta do Mês</p>
                <p className="text-xl font-bold text-graphite-100">{formatNumber(consolidado.meta_total)}</p>
              </div>
              <div>
                <p className="text-xs text-graphite-500 uppercase tracking-wider mb-1">Produção Acumulada</p>
                <p className="text-xl font-bold text-equatorial-green">{formatNumber(consolidado.producao_acumulada)}</p>
              </div>
              <div>
                <p className="text-xs text-graphite-500 uppercase tracking-wider mb-1">Dias Úteis Decorridos</p>
                <p className="text-xl font-bold text-graphite-100">
                  {consolidado.dias_uteis_decorridos}
                  <span className="text-sm text-graphite-500"> / {consolidado.dias_uteis_totais}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-graphite-500 uppercase tracking-wider mb-1">Média Diária Atual</p>
                <p className="text-xl font-bold text-equatorial-teal">
                  {formatNumber(Math.round(consolidado.media_diaria_realizada))}
                  <span className="text-sm text-graphite-500">/dia</span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-graphite-700">
              <p className="text-xs text-graphite-500 mb-2">Fórmula de projeção:</p>
              <div className="bg-graphite-950 rounded-lg p-3 text-center">
                <p className="text-sm text-graphite-300 font-mono">
                  Projeção = (Produção Acumulada ÷ Dias Úteis Decorridos) × Dias Úteis Totais
                </p>
                <p className="text-xs text-graphite-500 mt-2">
                  ({formatNumber(consolidado.producao_acumulada)} ÷ {consolidado.dias_uteis_decorridos}) × {consolidado.dias_uteis_totais} ={" "}
                  <strong className="text-equatorial-orange">{formatNumber(consolidado.projecao_total)}</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function classificar(percentual: number) {
  if (percentual >= 98) return "no_ritmo" as const;
  if (percentual >= 85) return "atencao" as const;
  return "risco" as const;
}

function CenarioBotao({ label, sublabel, icon: Icon, active, onClick, status }: {
  label: string; sublabel: string; icon: typeof Minus; active: boolean; onClick: () => void; status: string;
}) {
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  return (
    <button onClick={onClick} className={cn("flex flex-col items-center gap-1 p-3 rounded-lg border transition-all", active ? "bg-graphite-800 border-equatorial-orange" : "bg-graphite-850 border-graphite-700 hover:border-graphite-600")}>
      <Icon className={cn("h-4 w-4", active ? "text-equatorial-orange" : "text-graphite-500")} />
      <span className={cn("text-xs font-semibold", active ? "text-graphite-100" : "text-graphite-300")}>{label}</span>
      <span className="text-[10px] text-graphite-500">{sublabel}</span>
      <span className={cn("h-1.5 w-1.5 rounded-full", statusConfig?.dotColor)} />
    </button>
  );
}

function CenarioCard({ label, projecao, percentual, status, media, highlighted }: {
  label: string; projecao: number; percentual: number; status: string; media: number; highlighted: boolean;
}) {
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  return (
    <div className={cn("rounded-lg border p-3 transition-all", highlighted ? "bg-graphite-800 border-equatorial-orange/30" : "bg-graphite-850 border-graphite-700")}>
      <p className="text-[10px] text-graphite-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-lg font-bold text-graphite-100">{formatNumber(projecao)}</p>
      <p className="text-xs" style={{ color: statusConfig?.corHex }}>{formatPercent(percentual)}</p>
      <div className="w-full h-1 bg-graphite-700 rounded-full mt-2 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(percentual, 100)}%`, backgroundColor: statusConfig?.corHex }} />
      </div>
      <p className="text-[10px] text-graphite-500 mt-1.5">{formatNumber(Math.round(media))}/dia</p>
    </div>
  );
}