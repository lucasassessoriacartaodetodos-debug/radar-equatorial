import * as XLSX from "xlsx";
import {
  cadastroRowSchema,
  ValidationResult,
  isLinhaTotal,
} from "./validator";

export interface CadastroRow {
  estado: string;
  grupo: string;
  franquia: string;
  meta_mes: number;
}

export async function parseCadastroExcel(
  file: File
): Promise<ValidationResult<CadastroRow>> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    raw: true,
    defval: "",
  });

  const valid: CadastroRow[] = [];
  const invalid: { row: number; data: unknown; errors: string[] }[] = [];

  rawRows.forEach((rawRow, index) => {
    const row: Record<string, unknown> = {};
    Object.entries(rawRow).forEach(([key, value]) => {
      row[key.toLowerCase().trim()] = value;
    });

    if (!row.franquia || isLinhaTotal(row)) return;

    const metaMes = Number(row.meta_mes || row.meta || 0);

    const parsed = cadastroRowSchema.safeParse({
      estado: String(row.estado || "").trim(),
      grupo: String(row.grupo || "").trim(),
      franquia: String(row.franquia || "").trim(),
      meta_mes: metaMes,
    });

    if (parsed.success) {
      valid.push(parsed.data);
    } else {
      invalid.push({
        row: index + 2,
        data: rawRow,
        errors: parsed.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`),
      });
    }
  });

  return {
    valid,
    invalid,
    totalRows: rawRows.length,
    validCount: valid.length,
    invalidCount: invalid.length,
  };
}