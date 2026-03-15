"use server";

import {
  createLanguage,
  deleteLanguage,
  getAllLanguages,
  getLanguageById,
  getLanguageByName,
  getLanguagesWithCounts,
  getPopularLanguages,
  updateLanguage,
} from "@/lib/db/language-queries";

/**
 * Server Action: Obter todas as linguagens
 */
export async function getAllLanguagesAction() {
  try {
    const languages = await getAllLanguages();
    return { success: true, data: languages };
  } catch (error) {
    console.error("Erro ao obter linguagens:", error);
    return { success: false, error: "Falha ao obter linguagens" };
  }
}

/**
 * Server Action: Obter linguagem por ID
 */
export async function getLanguageAction(languageId: string) {
  try {
    const language = await getLanguageById(languageId);
    if (!language) {
      return { success: false, error: "Linguagem não encontrada" };
    }
    return { success: true, data: language };
  } catch (error) {
    console.error("Erro ao obter linguagem:", error);
    return { success: false, error: "Falha ao obter linguagem" };
  }
}

/**
 * Server Action: Obter linguagem por nome
 */
export async function getLanguageByNameAction(name: string) {
  try {
    const language = await getLanguageByName(name);
    if (!language) {
      return { success: false, error: "Linguagem não encontrada" };
    }
    return { success: true, data: language };
  } catch (error) {
    console.error("Erro ao obter linguagem:", error);
    return { success: false, error: "Falha ao obter linguagem" };
  }
}

/**
 * Server Action: Criar nova linguagem
 */
export async function createLanguageAction(name: string, displayName: string, color: string) {
  try {
    // Verificar se linguagem já existe
    const existing = await getLanguageByName(name);
    if (existing) {
      return { success: false, error: "Linguagem já existe" };
    }

    const language = await createLanguage(name, displayName, color);
    return { success: true, data: language };
  } catch (error) {
    console.error("Erro ao criar linguagem:", error);
    return { success: false, error: "Falha ao criar linguagem" };
  }
}

/**
 * Server Action: Atualizar linguagem
 */
export async function updateLanguageAction(languageId: string, displayName: string, color: string) {
  try {
    const language = await updateLanguage(languageId, displayName, color);
    return { success: true, data: language };
  } catch (error) {
    console.error("Erro ao atualizar linguagem:", error);
    return { success: false, error: "Falha ao atualizar linguagem" };
  }
}

/**
 * Server Action: Obter linguagens com contagem de roasts
 */
export async function getLanguagesWithCountsAction() {
  try {
    const languages = await getLanguagesWithCounts();
    return { success: true, data: languages };
  } catch (error) {
    console.error("Erro ao obter linguagens com contagem:", error);
    return {
      success: false,
      error: "Falha ao obter linguagens com contagem",
    };
  }
}

/**
 * Server Action: Obter linguagens populares
 */
export async function getPopularLanguagesAction(limit = 10) {
  try {
    const languages = await getPopularLanguages(limit);
    return { success: true, data: languages };
  } catch (error) {
    console.error("Erro ao obter linguagens populares:", error);
    return {
      success: false,
      error: "Falha ao obter linguagens populares",
    };
  }
}

/**
 * Server Action: Deletar linguagem
 */
export async function deleteLanguageAction(languageId: string) {
  try {
    const result = await deleteLanguage(languageId);
    return { success: !!result };
  } catch (error) {
    console.error("Erro ao deletar linguagem:", error);
    return { success: false, error: "Falha ao deletar linguagem" };
  }
}
