"use client";

import { cn } from "@/lib/utils";
import { STATUS_CONFIG, type StatusClassificacao } from "@/lib/utils";

interface VelocimetroProps {
  projecao: number;
  projecaoValor?: number;
  status: StatusClassificacao;
  size?: "sm" | "md" | "lg";
}

export function VelocimetroProjecao({
  projecao,
  projecaoValor,
  status,
  size = "md",
}: VelocimetroProps) {
  const corStatus = STATUS_CONFIG[status]?.corHex ?? "#9CA3AF";
  const clampedProjecao = Math.min(Math.max(projecao, 0), 100);
  const angulo = -90 + (clampedProjecao / 100) * 180;

  const sizes = {
    sm: { svg: "w-full max-w-[220px]", percent: "text-3xl", value: "text-xl", label: "text-[10px]" },
    md: { svg: "w-full max-w-[300px]", percent: "text-3xl", value: "text-2xl", label: "text-xs" },
    lg: { svg: "w-full max-w-[360px]", percent: "text-4xl", value: "text-3xl", label: "text-sm" },
  };

  const s = sizes[size];
  const formatNum = (val: number) => val.toLocaleString("pt-BR");

  return (
    <div className="flex flex-col items-center w-full">
      {/* Gauge */}
      <div className="relative w-full flex justify-center">
        <svg viewBox="0 0 200 140" className={cn(s.svg, "h-auto")}>
          {/* Track de fundo */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none" stroke="#2D323D" strokeWidth="14" strokeLinecap="round"
          />
          {/* Zona vermelha < 85% */}
          <path
            d="M 20 100 A 80 80 0 0 1 68 32"
            fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" opacity="0.35"
          />
          {/* Zona amarela 85-98% */}
          <path
            d="M 68 32 A 80 80 0 0 1 154 32"
            fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" opacity="0.35"
          />
          {/* Zona verde >= 98% */}
          <path
            d="M 154 32 A 80 80 0 0 1 180 100"
            fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" opacity="0.35"
          />
          {/* Arco de progresso */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none" stroke={corStatus} strokeWidth="14" strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset={251 - (251 * clampedProjecao) / 100}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
          {/* Marcadores */}
          {[0, 25, 50, 75, 100].map((mark) => {
            const angle = (-90 + (mark / 100) * 180) * (Math.PI / 180);
            const x1 = 100 + 68 * Math.cos(angle);
            const y1 = 100 + 68 * Math.sin(angle);
            const x2 = 100 + 78 * Math.cos(angle);
            const y2 = 100 + 78 * Math.sin(angle);
            return (
              <line key={mark} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4B515E" strokeWidth="1.5" />
            );
          })}
          {/* Labels 0% e 100% */}
          <text x="14" y="118" fill="#6B7280" fontSize="7" textAnchor="middle">0%</text>
          <text x="186" y="118" fill="#6B7280" fontSize="7" textAnchor="middle">100%</text>
          {/* Ponteiro */}
          <g
            style={{
              transform: `rotate(${angulo}deg)`,
              transformOrigin: "100px 100px",
              transition: "transform 0.8s ease-out",
            }}
          >
            <line x1="100" y1="100" x2="100" y2="32" stroke={corStatus} strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="32" r="3.5" fill={corStatus} />
          </g>
          {/* Centro do ponteiro */}
          <circle cx="100" cy="100" r="7" fill="#1A1D23" stroke={corStatus} strokeWidth="2" />
          <circle cx="100" cy="100" r="2.5" fill={corStatus} />
        </svg>

        {/* Percentual dentro do gauge */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-2">
          <span
            className={cn(s.percent, "font-bold leading-none")}
            style={{ color: corStatus }}
          >
            {clampedProjecao.toFixed(1).replace(".", ",")}%
          </span>
        </div>
      </div>

      {/* Valor da projeção ABAIXO do gauge */}
      <div className="text-center mt-4">
        {projecaoValor !== undefined && projecaoValor > 0 && (
          <>
            <p className={cn(s.value, "font-bold text-graphite-100 leading-tight")}>
              {formatNum(projecaoValor)} <span className="text-graphite-400">QIAS</span>
            </p>
            <p className={cn(s.label, "text-graphite-500 uppercase tracking-wider mt-1")}>
              Projeção Total
            </p>
          </>
        )}
      </div>
    </div>
  );
}