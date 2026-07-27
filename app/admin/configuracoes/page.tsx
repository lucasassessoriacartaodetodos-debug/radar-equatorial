"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, Loader2, Save, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ConfigRow {
  id: string;
  chave: string;
  valor: string;
  descricao: string;
}

export default function ConfiguracoesPage() {
  const queryClient = useQueryClient();
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const { data: configs, isLoading } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("configuracoes_sistema")
        .select("*")
        .order("chave");
      if (error) throw error;
      return data as ConfigRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (row: ConfigRow) => {
      const supabase = createClient();
      const newValue = editValues[row.id] ?? row.valor;
      const { error } = await supabase
        .from("configuracoes_sistema")
        .update({ valor: newValue })
        .eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      toast.success("Configuração salva");
    },
    onError: () => toast.error("Erro ao salvar configuração"),
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card><CardContent className="p-6 flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 text-graphite-500 animate-spin" />
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5 text-equatorial-orange" />
        <h2 className="text-xl font-bold text-graphite-100">Configurações do Sistema</h2>
      </div>

      <div className="space-y-3">
        {configs?.map((config) => (
          <Card key={config.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-graphite-400 uppercase tracking-wider mb-1 block">
                    {config.chave.replace(/_/g, " ")}
                  </label>
                  <p className="text-xs text-graphite-500 mb-2">{config.descricao}</p>
                  <input
                    type="text"
                    value={editValues[config.id] ?? config.valor}
                    onChange={(e) =>
                      setEditValues((prev) => ({ ...prev, [config.id]: e.target.value }))
                    }
                    className="eq-input"
                  />
                </div>
                <button
                  onClick={() => saveMutation.mutate(config)}
                  disabled={saveMutation.isPending}
                  className="flex items-center gap-1.5 bg-graphite-800 hover:bg-graphite-700 text-graphite-200 font-medium text-xs rounded-lg px-3 py-2 transition-colors disabled:opacity-50 shrink-0"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Salvar
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}