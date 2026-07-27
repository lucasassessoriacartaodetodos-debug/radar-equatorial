"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, History, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HistoricoPage() {
  const { data: importacoes, isLoading } = useQuery({
    queryKey: ["importacoes"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("importacoes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card><CardContent className="p-6 flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 text-graphite-500 animate-spin" />
        </CardContent></Card>
      </div>
    );
  }

  const statusConfig = {
    sucesso: { icon: CheckCircle2, color: "text-status-success", label: "Sucesso" },
    parcial: { icon: AlertTriangle, color: "text-status-warning", label: "Parcial" },
    erro: { icon: XCircle, color: "text-status-danger", label: "Erro" },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-equatorial-orange" />
        <h2 className="text-xl font-bold text-graphite-100">Histórico de Importações</h2>
      </div>

      {!importacoes || importacoes.length === 0 ? (
        <Card><CardContent className="p-6 text-center">
          <p className="text-sm text-graphite-500">Nenhuma importação registrada ainda.</p>
        </CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-graphite-700 text-graphite-400">
                    <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Data</th>
                    <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Tipo</th>
                    <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider">Arquivo</th>
                    <th className="text-right py-3 px-4 text-xs font-medium uppercase tracking-wider">Registros</th>
                    <th className="text-center py-3 px-4 text-xs font-medium uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importacoes.map((imp) => {
                    const config = statusConfig[imp.status as keyof typeof statusConfig] ?? statusConfig.erro;
                    const data = new Date(imp.created_at).toLocaleString("pt-BR");
                    return (
                      <tr key={imp.id} className="border-b border-graphite-800 hover:bg-graphite-800/50">
                        <td className="py-3 px-4 text-xs text-graphite-300">{data}</td>
                        <td className="py-3 px-4">
                          <span className={cn("text-xs font-medium", imp.tipo === "cadastro" ? "text-equatorial-orange" : "text-equatorial-teal")}>
                            {imp.tipo === "cadastro" ? "Cadastro" : "Produção"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-graphite-200">{imp.nome_arquivo}</td>
                        <td className="py-3 px-4 text-right text-xs text-graphite-300">{imp.total_registros ?? "—"}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <config.icon className={cn("h-4 w-4", config.color)} />
                            <span className="text-xs text-graphite-300">{config.label}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}