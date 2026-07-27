ALTER TABLE regionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE franquias ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas_mensais ENABLE ROW LEVEL SECURITY;
ALTER TABLE producao_diaria ENABLE ROW LEVEL SECURITY;
ALTER TABLE importacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE feriados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura publica de franquias" ON franquias FOR SELECT USING (true);
CREATE POLICY "Leitura publica de regionais" ON regionais FOR SELECT USING (true);
CREATE POLICY "Leitura publica de metas" ON metas_mensais FOR SELECT USING (true);
CREATE POLICY "Leitura publica de producao" ON producao_diaria FOR SELECT USING (true);
CREATE POLICY "Leitura publica de importacoes" ON importacoes FOR SELECT USING (true);
CREATE POLICY "Leitura publica de configuracoes" ON configuracoes_sistema FOR SELECT USING (true);
CREATE POLICY "Leitura publica de feriados" ON feriados FOR SELECT USING (true);