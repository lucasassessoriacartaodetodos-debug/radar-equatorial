import {
  DashboardFranquia,
  DashboardConsolidado,
  StatusClassificacao,
} from "@/lib/types";
import { classificarProjecao } from "@/lib/utils";

export function consolidarDashboard(
  franquias: DashboardFranquia[]
): DashboardConsolidado {
  const franquiasComMeta = franquias.filter(
    (f) => f.meta_operacional > 0 && f.status !== "sem_dados"
  );

  const meta_total = franquiasComMeta.reduce(
    (sum, f) => sum + f.meta_operacional,
    0
  );
  const producao_acumulada = franquiasComMeta.reduce(
    (sum, f) => sum + f.producao_acumulada,
    0
  );

  const producao_restante = Math.max(meta_total - producao_acumulada, 0);
  const percentual_atingido =
    meta_total > 0
      ? Math.round((producao_acumulada / meta_total) * 10000) / 100
      : 0;

  const primeiraComDados = franquiasComMeta[0];
  const dias_uteis_decorridos = primeiraComDados?.dias_uteis_decorridos ?? 0;
  const dias_uteis_totais = primeiraComDados?.dias_uteis_totais ?? 0;
  const dias_uteis_restantes = primeiraComDados?.dias_uteis_restantes ?? 0;

  const media_diaria_realizada =
    dias_uteis_decorridos > 0
      ? Math.round((producao_acumulada / dias_uteis_decorridos) * 100) / 100
      : 0;

  const media_diaria_necessaria =
    dias_uteis_restantes > 0
      ? Math.round((producao_restante / dias_uteis_restantes) * 100) / 100
      : 0;

  const projecao_total =
    dias_uteis_decorridos > 0
      ? Math.round((producao_acumulada / dias_uteis_decorridos) * dias_uteis_totais)
      : 0;

  const percentual_projecao =
    meta_total > 0 && dias_uteis_decorridos > 0
      ? Math.round((projecao_total / meta_total) * 10000) / 100
      : 0;

  const status = classificarProjecao(percentual_projecao);

  return {
    total_franquias: franquiasComMeta.length,
    meta_total,
    producao_acumulada,
    percentual_atingido,
    producao_restante,
    dias_uteis_decorridos,
    dias_uteis_totais,
    dias_uteis_restantes,
    media_diaria_realizada,
    media_diaria_necessaria,
    projecao_total,
    percentual_projecao,
    status,
  };
}

export function gerarResumoExecutivo(c: DashboardConsolidado): string {
  const statusText =
    c.status === "no_ritmo"
      ? "A operação está no ritmo ideal"
      : c.status === "atencao"
      ? "A operação requer atenção"
      : "A operação está em risco";

  return (
    `A produção acumulada representa ${c.percentual_atingido.toFixed(1).replace(
      ".",
      ","
    )}% da meta operacional. ` +
    `Mantendo o ritmo atual, a projeção de fechamento será de ${c.percentual_projecao.toFixed(
      1
    ).replace(".", ",")}%, totalizando ${c.projecao_total.toLocaleString(
      "pt-BR"
    )} QIAS. ` +
    `Restam ${c.producao_restante.toLocaleString("pt-BR")} QIAS para atingir a meta. ` +
    `A produção média necessária é de ${Math.round(
      c.media_diaria_necessaria
    ).toLocaleString("pt-BR")} QIAS por dia útil. ` +
    `${statusText}.`
  );
}