"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity, Loader2 } from "lucide-react";
import { STATUS_CONFIG } from "@/lib/utils";

interface ResumoExecutivoProps {
  texto: string;
  status: string;
  isLoading?: boolean;
}

export function ResumoExecutivo({ texto, status, isLoading }: ResumoExecutivoProps) {
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-equatorial-orange">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-graphite-500 animate-spin" />
            <span className="text-sm text-graphite-500">Gerando resumo...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const highlightText = (text: string) => {
    return text
      .replace(/(\d+[\d.,]*%)/g, '<strong class="text-equatorial-orange">$1</strong>')
      .replace(/(\d+[\d.]*\s+QIAS)/g, '<strong class="text-graphite-100">$1</strong>')
      .replace(/(\d+[\d.]*\s+QIAS\s+por\s+dia\s+útil)/g, '<strong class="text-equatorial-teal">$1</strong>')
      .replace(
        /(no ritmo|atenção|risco)/gi,
        `<strong style="color: ${statusConfig?.corHex ?? '#9CA3AF'}">$1</strong>`
      );
  };

  return (
    <Card className="border-l-4 border-l-equatorial-orange animate-fade-in">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Activity className="h-5 w-5 text-equatorial-orange shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-graphite-400 uppercase tracking-wider mb-1.5">
              Resumo Executivo
            </p>
            <p
              className="text-sm text-graphite-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightText(texto) }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}