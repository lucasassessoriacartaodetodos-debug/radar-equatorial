export type StatusClassificacao =
  | "no_ritmo"
  | "atencao"
  | "risco"
  | "sem_meta"
  | "sem_dados";

export interface DashboardFranquia {
  franquia_id: string;
  franquia: string;
  estado: string;
  grupo: string;
  regional_id: string;
  meta_operacional: number;
  producao_acumulada: number;
  data_referencia: string | null;
  percentual_atingido: number;
  producao_restante: number;
  dias_uteis_decorridos: number;
  dias_uteis_totais: number;
  dias_uteis_restantes: number;
  media_diaria_realizada: number;
  media_diaria_necessaria: number;
  projecao: number;
  percentual_projecao: number;
  status: StatusClassificacao;
}

export interface DashboardConsolidado {
  total_franquias: number;
  meta_total: number;
  producao_acumulada: number;
  percentual_atingido: number;
  producao_restante: number;
  dias_uteis_decorridos: number;
  dias_uteis_totais: number;
  dias_uteis_restantes: number;
  media_diaria_realizada: number;
  media_diaria_necessaria: number;
  projecao_total: number;
  percentual_projecao: number;
  status: StatusClassificacao;
}

export interface Franquia {
  id: string;
  regional_id: string;
  nome: string;
  estado: string;
  grupo: string;
  meta_operacional: number;
  ativo: boolean;
}

export interface Importacao {
  id: string;
  regional_id: string;
  tipo: "cadastro" | "producao";
  nome_arquivo: string;
  total_registros: number | null;
  status: "sucesso" | "erro" | "parcial";
  detalhes_erro: string | null;
  importado_por: string | null;
  created_at: string;
}

export interface FiltroDashboard {
  estado?: string;
  grupo?: string;
  franquia?: string;
}