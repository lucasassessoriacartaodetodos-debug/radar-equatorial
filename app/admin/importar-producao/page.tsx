"use client";

import { useState } from "react";
import { Dropzone } from "@/components/admin/dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { parseProducaoExcel, ProducaoRow } from "@/lib/import/parser-producao";
import { upsertProducao } from "@/lib/actions/import-producao";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, Loader2, FileSpreadsheet, Calendar } from "lucide-react";

export default function ImportarProducaoPage() {
  const [validRows, setValidRows] = useState<ProducaoRow[]>([]);
  const [invalidRows, setInvalidRows] = useState<{ row: number; errors: string[] }[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ atualizadas: number; criadas: number; total: number; dataRef: string } | null>(null);

  const handleFileSelect = async (file: File) => {
    setFileName(file.name);
    setResult(null);
    try {
      const parsed = await parseProducaoExcel(file);
      setValidRows(parsed.valid);
      setInvalidRows(parsed.invalid);
      if (parsed.valid.length > 0) {
        toast.success(`${parsed.valid.length} registros válidos encontrados`);
      }
      if (parsed.invalid.length > 0) {
        toast.warning(`${parsed.invalid.length} linhas com erro foram ignoradas`);
      }
    } catch {
      toast.error("Erro ao ler o arquivo. Verifique o formato.");
      setValidRows([]);
      setInvalidRows([]);
    }
  };

  const handleImport = async () => {
    if (validRows.length === 0) return;
    setImporting(true);
    try {
      const res = await upsertProducao(validRows, fileName, "admin");
      if (res.success) {
        setResult({
          atualizadas: res.atualizadas ?? 0,
          criadas: res.criadas ?? 0,
          total: res.total ?? 0,
          dataRef: res.dataReferencia ?? "",
        });
        toast.success(`Importação concluída: ${res.atualizadas} atualizados, ${res.criadas} criados`);
        setValidRows([]);
        setInvalidRows([]);
      } else {
        toast.error(res.error || "Erro na importação");
      }
    } catch {
      toast.error("Erro inesperado ao importar");
    }
    setImporting(false);
  };

  const dataRefFormatada = result?.dataRef
    ? new Date(result.dataRef + "T00:00:00").toLocaleDateString("pt-BR")
    : new Date(Date.now() - 86400000).toLocaleDateString("pt-BR");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-graphite-100">Importar Produção Diária</h2>
        <p className="text-sm text-graphite-400 mt-1">
          Selecione a planilha com a produção acumulada de cada franquia.
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-graphite-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>Os dados serão registrados com data de referência: {dataRefFormatada} (D-1)</span>
        </div>
      </div>

      <Dropzone onFileSelect={handleFileSelect} accept=".xlsx,.xls" disabled={importing} />

      {result && (
        <Card className="border-status-success/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-status-success" />
              <div>
                <p className="text-sm font-semibold text-graphite-100">Importação concluída!</p>
                <p className="text-xs text-graphite-400">
                  {result.atualizadas} franquias atualizadas, {result.criadas} criadas. Total: {result.total}. Data: {dataRefFormatada}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {invalidRows.length > 0 && (
        <Card className="border-status-warning/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-status-warning" />
              <span className="text-sm font-semibold text-graphite-100">
                {invalidRows.length} linhas com erro (ignoradas)
              </span>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {invalidRows.slice(0, 20).map((r, i) => (
                <div key={i} className="text-xs text-graphite-400">
                  Linha {r.row}: {r.errors.join(", ")}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {validRows.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-equatorial-teal" />
                <span className="text-sm font-semibold text-graphite-100">
                  Pré-visualização ({validRows.length} franquias)
                </span>
              </div>
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-2 bg-equatorial-orange hover:bg-equatorial-orange-hover text-white font-medium text-sm rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
              >
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {importing ? "Importando..." : "Confirmar Importação"}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-graphite-700 text-graphite-400">
                    <th className="text-left py-2 px-2">Franquia</th>
                    <th className="text-right py-2 px-2">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {validRows.slice(0, 10).map((row, i) => (
                    <tr key={i} className="border-b border-graphite-800">
                      <td className="py-1.5 px-2 text-graphite-100">{row.franquia}</td>
                      <td className="py-1.5 px-2 text-right text-graphite-200">{row.resultado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {validRows.length > 10 && (
                <p className="text-xs text-graphite-500 mt-2 text-center">
                  ... e mais {validRows.length - 10} franquias
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}