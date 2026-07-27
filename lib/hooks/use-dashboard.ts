"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { DashboardFranquia, FiltroDashboard } from "@/lib/types";

export function useDashboardData(filtros: FiltroDashboard = {}) {
  return useQuery({
    queryKey: ["dashboard", filtros],
    queryFn: async () => {
      const supabase = createClient();

      const now = new Date();
      const ano = now.getFullYear();
      const mes = now.getMonth() + 1;

      const { data, error } = await supabase.rpc("get_dashboard_operacional", {
        p_ano: ano,
        p_mes: mes,
      });

      if (error) throw error;

      let resultado = data as DashboardFranquia[];

      if (filtros.estado) {
        resultado = resultado.filter((f) => f.estado === filtros.estado);
      }
      if (filtros.grupo) {
        resultado = resultado.filter((f) => f.grupo === filtros.grupo);
      }
      if (filtros.franquia) {
        resultado = resultado.filter((f) => f.franquia === filtros.franquia);
      }

      return resultado;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}