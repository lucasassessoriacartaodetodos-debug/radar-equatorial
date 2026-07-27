import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Radar, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-graphite-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="relative h-12 w-12 flex items-center justify-center mx-auto mb-4">
              <Radar className="h-10 w-10 text-equatorial-orange" />
            </div>
            <h2 className="text-2xl font-bold text-graphite-100 mb-2">404</h2>
            <p className="text-sm text-graphite-400 mb-6">
              A página que você procura não existe ou foi movida.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-graphite-800
                         hover:bg-graphite-700 text-graphite-100 font-medium text-sm
                         rounded-lg px-4 py-2.5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}