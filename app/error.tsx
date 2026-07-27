"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-graphite-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="border-status-danger/20">
          <CardContent className="p-8 text-center">
            <div className="h-14 w-14 rounded-full bg-status-danger/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-7 w-7 text-status-danger" />
            </div>
            <h2 className="text-lg font-bold text-graphite-100 mb-2">
              Algo deu errado
            </h2>
            <p className="text-sm text-graphite-400 mb-6">
              Ocorreu um erro inesperado ao carregar o painel.
              Você pode tentar novamente.
            </p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-equatorial-orange
                         hover:bg-equatorial-orange-hover text-white font-medium text-sm
                         rounded-lg px-4 py-2.5 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-graphite-600 mt-4">
          Código: {error.digest || "desconhecido"}
        </p>
      </div>
    </div>
  );
}