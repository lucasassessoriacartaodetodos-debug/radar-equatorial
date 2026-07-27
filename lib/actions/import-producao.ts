"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

interface ProducaoRow {
  franquia: string;
  resultado: number;
}

export async function upsertProducao(
  rows: ProducaoRow[],
  nomeArquivo: string,
  importadoPor: string
) {
  const supabase = createAdminClient();

  const { data: regional, error: regionalError } = await supabase
    .from("regionais")
    .select("id")
    .eq("slug", "equatorial")
    .single();

  if (regionalError || !regional) {
    return {
      success: false,
      error: "Regional não encontrada. Execute o seed primeiro.",
    };
  }

  const { data: importacao, error: importacaoError } = await supabase
    .from("importacoes")
    .insert({
      regional_id: regional.id,
      tipo: "producao",
      nome_arquivo: nomeArquivo,
      total_registros: rows.length,
      status: "sucesso",
      importado_por: importadoPor,
    })
    .select("id")
    .single();

  if (importacaoError || !importacao) {
    return { success: false, error: "Erro ao registrar importação." };
  }

  const dataReferencia = new Date();
  dataReferencia.setDate(dataReferencia.getDate() - 1);
  const dataRef = dataReferencia.toISOString().split("T")[0];

  const { data: franquias } = await supabase
    .from("franquias")
    .select("id, nome")
    .eq("regional_id", regional.id)
    .eq("ativo", true);

  const franquiaMap = new Map<string, string>();
  franquias?.forEach((f) => {
    franquiaMap.set(f.nome.toUpperCase().trim(), f.id);
  });

  let atualizadas = 0;
  let criadas = 0;
  let naoEncontradas: string[] = [];

  for (const row of rows) {
    const franquiaId = franquiaMap.get(row.franquia.toUpperCase().trim());

    if (!franquiaId) {
      naoEncontradas.push(row.franquia);
      continue;
    }

    const { data: existing } = await supabase
      .from("producao_diaria")
      .select("id")
      .eq("franquia_id", franquiaId)
      .eq("data_referencia", dataRef)
      .single();

    if (existing) {
      const { error: updateError } = await supabase
        .from("producao_diaria")
        .update({
          producao_acumulada: row.resultado,
          importacao_id: importacao.id,
        })
        .eq("id", existing.id);

      if (updateError) {
        naoEncontradas.push(`${row.franquia}: ${updateError.message}`);
      } else {
        atualizadas++;
      }
    } else {
      const { error: insertError } = await supabase
        .from("producao_diaria")
        .insert({
          franquia_id: franquiaId,
          data_referencia: dataRef,
          producao_acumulada: row.resultado,
          importacao_id: importacao.id,
        });

      if (insertError) {
        naoEncontradas.push(`${row.franquia}: ${insertError.message}`);
      } else {
        criadas++;
      }
    }
  }

  if (naoEncontradas.length > 0 && naoEncontradas.length < rows.length) {
    await supabase
      .from("importacoes")
      .update({
        status: "parcial",
        detalhes_erro: `Franquias não encontradas: ${naoEncontradas.join(", ")}`,
      })
      .eq("id", importacao.id);
  } else if (naoEncontradas.length === rows.length) {
    await supabase
      .from("importacoes")
      .update({
        status: "erro",
        detalhes_erro: `Nenhuma franquia encontrada: ${naoEncontradas.join(", ")}`,
      })
      .eq("id", importacao.id);
  }

  revalidatePath("/");
  revalidatePath("/operacional");
  revalidatePath("/ranking");
  revalidatePath("/projecoes");

  return {
    success: true,
    importacaoId: importacao.id,
    atualizadas,
    criadas,
    naoEncontradas,
    dataReferencia: dataRef,
    total: rows.length,
  };
}