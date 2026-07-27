import * as XLSX from "xlsx";
import {
  producaoRowSchema,
  ValidationResult,
  isLinhaTotal,
} from "./validator";

export interface ProducaoRow {
  franquia: string;
  resultado: number;
}

export async function parseProducaoExcel(
  file: File
): Promise<ValidationResult<ProducaoRow>> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    raw: true,
    defval: "",
  });

  const valid: ProducaoRow[] = [];
  const invalid: { row: number; data: unknown; errors: string[] }[] = [];

  rawRows.forEach((rawRow, index) => {
    const row: Record<string, unknown> = {};
    Object.entries(rawRow).forEach(([key, value]) => {
      row[key.toLowerCase().trim()] = value;
    });

    if (!row.franquia || isLinhaTotal(row)) return;

    const resultado = Number(row.resultado || 0);

    const parsed = producaoRowSchema.safeParse({
      franquia: String(row.franquia || "").trim(),
      resultado,
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