import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  FileSpreadsheet,
  History,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const menuItems = [
  { label: "Importar Cadastro", href: "/admin/importar-cadastro", icon: Upload },
  { label: "Importar Produção", href: "/admin/importar-producao", icon: FileSpreadsheet },
  { label: "Histórico", href: "/admin/historico", icon: History },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const userEmail = session.user.email ?? "";

  return (
    <div className="min-h-screen bg-graphite-900 flex">
      <aside className="fixed inset-y-0 left-0 z-40 flex flex-col bg-graphite-950 border-r border-graphite-700 w-64">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-graphite-700">
          <div className="relative h-8 w-8 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-8 w-8">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#2D323D" strokeWidth="1" />
              <circle cx="18" cy="18" r="6" fill="none" stroke="#2D323D" strokeWidth="1" />
              <line x1="18" y1="8" x2="18" y2="28" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="18" x2="28" y2="18" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="18" cy="18" r="2" fill="#FF9933" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-graphite-100 leading-tight">Admin</p>
            <p className="text-[11px] text-graphite-400 leading-tight">Radar Equatorial</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="eq-nav-item"
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-graphite-700 space-y-1">
          <Link href="/" className="eq-nav-item">
            <LayoutDashboard className="h-[18px] w-[18px] shrink-0" />
            <span>Ver Painel</span>
          </Link>
          <form action="/login" method="post">
            <button type="submit" className="eq-nav-item w-full text-left">
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              <span>Sair</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 ml-64">
        <header className="eq-glass sticky top-0 z-30 h-16 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-graphite-100">Área Administrativa</h1>
          <span className="text-xs text-graphite-400">{userEmail}</span>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}