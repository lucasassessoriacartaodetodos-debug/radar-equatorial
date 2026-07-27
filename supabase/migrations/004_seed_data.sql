INSERT INTO regionais (nome, slug)
VALUES ('Equatorial', 'equatorial')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO configuracoes_sistema (chave, valor, descricao) VALUES
  ('limiar_no_ritmo', '98', 'Percentual minimo para status No Ritmo'),
  ('limiar_atencao', '85', 'Percentual minimo para status Atencao'),
  ('dias_uteis_padrao', '22', 'Dias uteis padrao do mes'),
  ('timezone', 'America/Sao_Paulo', 'Fuso horario do sistema')
ON CONFLICT (chave) DO NOTHING;

INSERT INTO feriados (data, descricao, abrangencia) VALUES
  ('2026-01-01', 'Confraternizacao Universal', 'nacional'),
  ('2026-02-16', 'Carnaval', 'nacional'),
  ('2026-02-17', 'Carnaval', 'nacional'),
  ('2026-04-03', 'Sexta-feira Santa', 'nacional'),
  ('2026-04-21', 'Tiradentes', 'nacional'),
  ('2026-05-01', 'Dia do Trabalho', 'nacional'),
  ('2026-09-07', 'Independencia do Brasil', 'nacional'),
  ('2026-10-12', 'Nossa Senhora Aparecida', 'nacional'),
  ('2026-11-02', 'Finados', 'nacional'),
  ('2026-11-15', 'Proclamacao da Republica', 'nacional'),
  ('2026-12-25', 'Natal', 'nacional')
ON CONFLICT (data) DO NOTHING;