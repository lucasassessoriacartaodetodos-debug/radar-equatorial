"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { FiltroDashboard } from "@/lib/types";

export function useFiltros() {
  const [estado, setEstado] = useState<string>("");
  const [grupo, setGrupo] = useState<string>("");
  const [franquia, setFranquia] = useState<string>("");

  const filtros: FiltroDashboard = useMemo(() => {
    const f: FiltroDashboard = {};
    if (estado) f.estado = estado;
    if (grupo) f.grupo = grupo;
    if (franquia) f.franquia = franquia;
    return f;
  }, [estado, grupo, franquia]);

  const limparFiltros = useCallback(() => {
    setEstado("");
    setGrupo("");
    setFranquia("");
  }, []);

  const hasFiltrosAtivos = !!(estado || grupo || franquia);

  return {
    estado,
    grupo,
    franquia,
    setEstado,
    setGrupo,
    setFranquia,
    filtros,
    limparFiltros,
    hasFiltrosAtivos,
  };
}

export function useFiltroOpcoes() {
  return useQuery({
    queryKey: ["filtro-opcoes"],
    queryFn: async () => {
      const supabase = createClient();

      const { data: franquias } = await supabase
        .from("franquias")
        .select("estado, grupo, nome")
        .eq("ativo", true)
        .order("nome");

      const estados = [...new Set(franquias?.map((f) => f.estado) || [])].sort();
      const grupos = [...new Set(franquias?.map((f) => f.grupo) || [])].sort();
      const nomes = [...new Set(franquias?.map((f) => f.nome) || [])].sort();

      return { estados, grupos, franquias: nomes };
    },
    staleTime: 1000 * 60 * 30,
  });
}