"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciais inválidas. Verifique e tente novamente.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-graphite-950 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="relative h-14 w-14 mx-auto mb-3 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-14 w-14">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#2D323D" strokeWidth="1" />
              <circle cx="18" cy="18" r="11" fill="none" stroke="#2D323D" strokeWidth="1" />
              <circle cx="18" cy="18" r="6" fill="none" stroke="#2D323D" strokeWidth="1" />
              <line x1="18" y1="8" x2="18" y2="28" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="8" y1="18" x2="28" y2="18" stroke="#FF9933" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="18" cy="18" r="2" fill="#FF9933" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-graphite-100">Radar Equatorial</h1>
          <p className="text-xs text-graphite-500 mt-1">Área Administrativa</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-graphite-400 uppercase tracking-wider mb-1.5 block">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="eq-input pl-9"
                    placeholder="admin@regionalequatorial.com.br"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-graphite-400 uppercase tracking-wider mb-1.5 block">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-graphite-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="eq-input pl-9"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-status-danger bg-status-danger-soft/30 border border-status-danger/20 rounded-lg p-2.5">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-equatorial-orange hover:bg-equatorial-orange-hover text-white font-medium text-sm rounded-lg px-4 py-2.5 transition-colors disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}