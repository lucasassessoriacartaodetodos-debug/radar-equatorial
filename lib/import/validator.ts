import { z } from "zod";

export const cadastroRowSchema = z.object({
  estado: z
    .string()
    .min(2, "Estado obrigatório")
    .max(2, "Estado deve ter 2 caracteres")
    .toUpperCase(),
  grupo: z
    .string()
    .min(1, "Grupo obrigatório")
    .toUpperCase(),
  franquia: z.string().min(1, "Nome da franquia obrigatório"),
  meta_mes: z
    .number()
    .int("Meta deve ser número inteiro")
    .min(0, "Meta não pode ser negativa"),
});

export const cadastroSchema = z.array(cadastroRowSchema);

export const producaoRowSchema = z.object({
  franquia: z.string().min(1, "Nome da franquia obrigatório"),
  resultado: z
    .number()
    .int("Resultado deve ser número inteiro")
    .min(0, "Resultado não pode ser negativo"),
});

export const producaoSchema = z.array(producaoRowSchema);

export interface ValidationResult<T> {
  valid: T[];
  invalid: { row: number; data: unknown; errors: string[] }[];
  totalRows: number;
  validCount: number;
  invalidCount: number;
}

export function isLinhaTotal(row: Record<string, unknown>): boolean {
  const franquia = String(row.franquia || row.Franquia || "").toUpperCase();
  return franquia.includes("TOTAL");
}