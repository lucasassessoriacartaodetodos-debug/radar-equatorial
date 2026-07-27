"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

interface CadastroRow {
  estado: string;
  grupo: string;
  franquia: string;
  meta_mes: number;
}

export async function upsertCadastro(
  rows: CadastroRow[],
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
      tipo: "cadastro",
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

  let atualizadas = 0;
  let criadas = 0;
  let erros: string[] = [];

  for (const row of rows) {
    const { data: existing } = await supabase
      .from("franquias")
      .select("id")
      .eq("nome", row.franquia)
      .eq("regional_id", regional.id)
      .single();

    if (existing) {
      const { error: updateError } = await supabase
        .from("franquias")
        .update({
          estado: row.estado,
          grupo: row.grupo,
          meta_operacional: row.meta_mes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        erros.push(`Linha "${row.franquia}": ${updateError.message}`);
      } else {
        atualizadas++;
      }
    } else {
      const { error: insertError } = await supabase
        .from("franquias")
        .insert({
          regional_id: regional.id,
          nome: row.franquia,
          estado: row.estado,
          grupo: row.grupo,
          meta_operacional: row.meta_mes,
          ativo: true,
        });

      if (insertError) {
        erros.push(`Linha "${row.franquia}": ${insertError.message}`);
      } else {
        criadas++;
      }
    }

    const now = new Date();
    const ano = now.getFullYear();
    const mes = now.getMonth() + 1;

    const franquiaId = existing?.id;
    if (franquiaId) {
      await supabase
        .from("metas_mensais")
        .upsert(
          {
            franquia_id: franquiaId,
            ano,
            mes,
            meta_operacional: row.meta_mes,
          },
          { onConflict: "franquia_id,ano,mes" }
        );
    }
  }

  if (erros.length > 0 && erros.length < rows.length) {
    await supabase
      .from("importacoes")
      .update({
        status: "parcial",
        detalhes_erro: erros.join("\n"),
      })
      .eq("id", importacao.id);
  } else if (erros.length === rows.length) {
    await supabase
      .from("importacoes")
      .update({
        status: "erro",
        detalhes_erro: erros.join("\n"),
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
    erros,
    total: rows.length,
  };
}