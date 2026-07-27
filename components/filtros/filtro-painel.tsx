"use client";

import { useFiltroOpcoes } from "@/lib/hooks/use-filtros";
import { Filter, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltroPainelProps {
  estado: string;
  grupo: string;
  franquia: string;
  setEstado: (v: string) => void;
  setGrupo: (v: string) => void;
  setFranquia: (v: string) => void;
  onLimpar: () => void;
  hasFiltrosAtivos: boolean;
}

export function FiltroPainel({
  estado,
  grupo,
  franquia,
  setEstado,
  setGrupo,
  setFranquia,
  onLimpar,
  hasFiltrosAtivos,
}: FiltroPainelProps) {
  const { data: opcoes, isLoading } = useFiltroOpcoes();

  if (isLoading) {
    return (
      <div className="eq-card p-3 flex items-center gap-2">
        <Filter className="h-4 w-4 text-graphite-500" />
        <span className="text-sm text-graphite-500">Carregando filtros...</span>
      </div>
    );
  }

  const selectClass =
    "bg-graphite-800 border border-graphite-700 rounded-lg px-3 py-2 text-sm text-graphite-100 " +
    "focus:outline-none focus:ring-1 focus:ring-equatorial-orange focus:border-equatorial-orange " +
    "transition-colors cursor-pointer appearance-none";

  return (
    <div className="eq-card p-3 flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 mr-2 shrink-0">
        <Filter className="h-4 w-4 text-equatorial-orange" />
        <span className="text-xs font-medium text-graphite-400 uppercase tracking-wider hidden sm:inline">
          Filtros
        </span>
      </div>

      <div className="relative">
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className={cn(selectClass, "pr-8 min-w-[120px]")}
        >
          <option value="">Todos os estados</option>
          {opcoes?.estados.map((est) => (
            <option key={est} value={est}>{est}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-graphite-500 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={grupo}
          onChange={(e) => setGrupo(e.target.value)}
          className={cn(selectClass, "pr-8 min-w-[140px]")}
        >
          <option value="">Todos os grupos</option>
          {opcoes?.grupos.map((grp) => (
            <option key={grp} value={grp}>{grp}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-graphite-500 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={franquia}
          onChange={(e) => setFranquia(e.target.value)}
          className={cn(selectClass, "pr-8 min-w-[180px]")}
        >
          <option value="">Todas as franquias</option>
          {opcoes?.franquias.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-graphite-500 pointer-events-none" />
      </div>

      {hasFiltrosAtivos && (
        <button
          onClick={onLimpar}
          className="flex items-center gap-1 text-xs text-graphite-400
                     hover:text-status-danger transition-colors px-2 py-1"
        >
          <X className="h-3.5 w-3.5" />
          Limpar
        </button>
      )}
    </div>
  );
}