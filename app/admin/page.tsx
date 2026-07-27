import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileSpreadsheet, History, Settings, ArrowRight } from "lucide-react";

const actions = [
  { label: "Importar Cadastro", href: "/admin/importar-cadastro", icon: Upload, desc: "Importe a planilha de cadastro de franquias" },
  { label: "Importar Produção", href: "/admin/importar-producao", icon: FileSpreadsheet, desc: "Importe a planilha de produção diária" },
  { label: "Histórico", href: "/admin/historico", icon: History, desc: "Veja todas as importações realizadas" },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings, desc: "Ajuste parâmetros do sistema" },
];

export default function AdminHome() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-graphite-100">Bem-vindo</h2>
        <p className="text-sm text-graphite-400 mt-1">
          Selecione uma ação abaixo para gerenciar o Radar Equatorial.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((a) => (
          <Link key={a.href} href={a.href}>
            <Card className="eq-card-hover cursor-pointer">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-lg bg-graphite-800 flex items-center justify-center shrink-0">
                  <a.icon className="h-5 w-5 text-equatorial-orange" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-graphite-100">{a.label}</h3>
                  <p className="text-xs text-graphite-400 mt-0.5">{a.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-graphite-500" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}