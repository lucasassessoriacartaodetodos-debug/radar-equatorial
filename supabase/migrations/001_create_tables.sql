CREATE TABLE IF NOT EXISTS regionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS franquias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  regional_id UUID NOT NULL REFERENCES regionais(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  estado TEXT NOT NULL,
  grupo TEXT NOT NULL,
  meta_operacional INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS metas_mensais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franquia_id UUID NOT NULL REFERENCES franquias(id) ON DELETE CASCADE,
  ano INTEGER NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  meta_operacional INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(franquia_id, ano, mes)
);

CREATE TABLE IF NOT EXISTS producao_diaria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franquia_id UUID NOT NULL REFERENCES franquias(id) ON DELETE CASCADE,
  data_referencia DATE NOT NULL,
  producao_acumulada INTEGER DEFAULT 0,
  importacao_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(franquia_id, data_referencia)
);

CREATE TABLE IF NOT EXISTS importacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  regional_id UUID NOT NULL REFERENCES regionais(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('cadastro', 'producao')),
  nome_arquivo TEXT NOT NULL,
  total_registros INTEGER,
  status TEXT DEFAULT 'sucesso' CHECK (status IN ('sucesso', 'erro', 'parcial')),
  detalhes_erro TEXT,
  importado_por TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS configuracoes_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  descricao TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feriados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  abrangencia TEXT DEFAULT 'nacional',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_franquias_regional ON franquias(regional_id);
CREATE INDEX IF NOT EXISTS idx_franquias_nome ON franquias(nome);
CREATE INDEX IF NOT EXISTS idx_producao_franquia_data ON producao_diaria(franquia_id, data_referencia);
CREATE INDEX IF NOT EXISTS idx_importacoes_regional ON importacoes(regional_id);
CREATE INDEX IF NOT EXISTS idx_metas_franquia_ano_mes ON metas_mensais(franquia_id, ano, mes);