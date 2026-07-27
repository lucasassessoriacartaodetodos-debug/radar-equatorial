CREATE OR REPLACE FUNCTION calcular_dias_uteis(
  p_data_inicio DATE,
  p_data_fim DATE
)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_total INTEGER := 0;
  v_data DATE := p_data_inicio;
  v_feriado_count INTEGER;
BEGIN
  WHILE v_data <= p_data_fim LOOP
    IF EXTRACT(DOW FROM v_data) NOT IN (0, 6) THEN
      SELECT COUNT(*) INTO v_feriado_count
      FROM feriados
      WHERE data = v_data;

      IF v_feriado_count = 0 THEN
        v_total := v_total + 1;
      END IF;
    END IF;
    v_data := v_data + 1;
  END LOOP;

  RETURN v_total;
END;
$$;

CREATE OR REPLACE FUNCTION get_dashboard_operacional(
  p_ano INTEGER,
  p_mes INTEGER
)
RETURNS TABLE (
  franquia_id UUID,
  franquia TEXT,
  estado TEXT,
  grupo TEXT,
  regional_id UUID,
  meta_operacional INTEGER,
  producao_acumulada INTEGER,
  data_referencia DATE,
  percentual_atingido NUMERIC,
  producao_restante INTEGER,
  dias_uteis_decorridos INTEGER,
  dias_uteis_totais INTEGER,
  dias_uteis_restantes INTEGER,
  media_diaria_realizada NUMERIC,
  media_diaria_necessaria NUMERIC,
  projecao INTEGER,
  percentual_projecao NUMERIC,
  status TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_data_inicio DATE;
  v_data_fim DATE;
  v_data_hoje DATE;
  v_data_referencia DATE;
  v_dias_uteis_decorridos INTEGER;
  v_dias_uteis_totais INTEGER;
  v_dias_uteis_restantes INTEGER;
BEGIN
  v_data_inicio := make_date(p_ano, p_mes, 1);
  v_data_fim := (date_trunc('month', v_data_inicio) + interval '1 month' - interval '1 day')::date;
  v_data_hoje := current_date;

  IF v_data_hoje > v_data_fim THEN
    v_data_referencia := v_data_fim;
    v_dias_uteis_decorridos := calcular_dias_uteis(v_data_inicio, v_data_fim);
  ELSIF v_data_hoje < v_data_inicio THEN
    v_data_referencia := NULL;
    v_dias_uteis_decorridos := 0;
  ELSE
    v_data_referencia := v_data_hoje - 1;
    v_dias_uteis_decorridos := calcular_dias_uteis(v_data_inicio, v_data_referencia);
  END IF;

  v_dias_uteis_totais := calcular_dias_uteis(v_data_inicio, v_data_fim);
  v_dias_uteis_restantes := v_dias_uteis_totais - v_dias_uteis_decorridos;

  RETURN QUERY
  SELECT
    f.id,
    f.nome,
    f.estado,
    f.grupo,
    f.regional_id,
    f.meta_operacional,
    COALESCE(p.producao_acumulada, 0) AS producao_acumulada,
    v_data_referencia AS data_referencia,
    CASE
      WHEN f.meta_operacional > 0 THEN
        ROUND((COALESCE(p.producao_acumulada, 0)::NUMERIC / f.meta_operacional) * 10000) / 100
      ELSE 0
    END AS percentual_atingido,
    GREATEST(f.meta_operacional - COALESCE(p.producao_acumulada, 0), 0) AS producao_restante,
    v_dias_uteis_decorridos,
    v_dias_uteis_totais,
    v_dias_uteis_restantes,
    CASE
      WHEN v_dias_uteis_decorridos > 0 THEN
        ROUND((COALESCE(p.producao_acumulada, 0)::NUMERIC / v_dias_uteis_decorridos) * 100) / 100
      ELSE 0
    END AS media_diaria_realizada,
    CASE
      WHEN v_dias_uteis_restantes > 0 THEN
        ROUND((GREATEST(f.meta_operacional - COALESCE(p.producao_acumulada, 0), 0)::NUMERIC / v_dias_uteis_restantes) * 100) / 100
      ELSE 0
    END AS media_diaria_necessaria,
    CASE
      WHEN v_dias_uteis_decorridos > 0 AND f.meta_operacional > 0 THEN
        (COALESCE(p.producao_acumulada, 0)::NUMERIC / v_dias_uteis_decorridos * v_dias_uteis_totais)::INTEGER
      ELSE 0
    END AS projecao,
    CASE
      WHEN f.meta_operacional > 0 AND v_dias_uteis_decorridos > 0 THEN
        ROUND(((COALESCE(p.producao_acumulada, 0)::NUMERIC / v_dias_uteis_decorridos * v_dias_uteis_totais) / f.meta_operacional) * 10000) / 100
      ELSE 0
    END AS percentual_projecao,
    CASE
      WHEN f.meta_operacional = 0 THEN 'sem_meta'
      WHEN COALESCE(p.producao_acumulada, 0) = 0 THEN 'sem_dados'
      WHEN f.meta_operacional > 0 AND v_dias_uteis_decorridos > 0 THEN
        CASE
          WHEN (COALESCE(p.producao_acumulada, 0)::NUMERIC / v_dias_uteis_decorridos * v_dias_uteis_totais / f.meta_operacional) >= 0.98 THEN 'no_ritmo'
          WHEN (COALESCE(p.producao_acumulada, 0)::NUMERIC / v_dias_uteis_decorridos * v_dias_uteis_totais / f.meta_operacional) >= 0.85 THEN 'atencao'
          ELSE 'risco'
        END
      ELSE 'sem_dados'
    END AS status
  FROM franquias f
  LEFT JOIN LATERAL (
    SELECT producao_acumulada
    FROM producao_diaria
    WHERE franquia_id = f.id
    ORDER BY data_referencia DESC
    LIMIT 1
  ) p ON true
  WHERE f.ativo = true;
END;
$$;