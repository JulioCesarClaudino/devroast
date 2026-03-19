"use server";

import {
  createComment,
  decrementCommentLikes,
  deleteComment,
  incrementCommentLikes,
  updateComment,
} from "@/lib/db/comment-queries";
import { isFavorited, toggleFavorite } from "@/lib/db/favorite-queries";
import { createIssue, createIssues } from "@/lib/db/issue-queries";
import {
  createRoast,
  getCommentsByRoast,
  getIssuesByRoast,
  getLeaderboard,
  getRoastById,
  getRoasts,
  getRoastsByLanguage,
  getSuggestionsByRoast,
  incrementRoastViews,
} from "@/lib/db/roast-queries";

/**
 * Server Action: Criar novo roast
 * Note: roastScore, verdict, and roastComment should come from AI API
 * For now, using placeholder values
 */
export async function createRoastAction(
  code: string,
  languageId: string | null,
  userId: string | null
) {
  try {
    const roast = await createRoast({
      userId: userId || undefined,
      code,
      languageId: languageId || "unknown",
      roastScore: 0, // TODO: Get from AI API
      verdict: "pending", // TODO: Get from AI API
      roastComment: "Roast analysis pending...", // TODO: Get from AI API
      issueCount: 0,
    });
    return { success: true, data: roast };
  } catch (error) {
    console.error("Erro ao criar roast:", error);
    return { success: false, error: "Falha ao criar roast" };
  }
}

/**
 * Server Action: Obter roast com todos os detalhes
 */
export async function getRoastDetailsAction(roastId: string) {
  try {
    const roast = await getRoastById(roastId);

    if (!roast) {
      return { success: false, error: "Roast não encontrado" };
    }

    // Incrementar visualizações
    await incrementRoastViews(roastId);

    // Obter issues, sugestões e comentários
    const [issues, suggestions, comments] = await Promise.all([
      getIssuesByRoast(roastId),
      getSuggestionsByRoast(roastId),
      getCommentsByRoast(roastId, 10, 0),
    ]);

    return {
      success: true,
      data: {
        roast,
        issues,
        suggestions,
        comments,
      },
    };
  } catch (error) {
    console.error("Erro ao obter roast:", error);
    return { success: false, error: "Falha ao obter roast" };
  }
}

/**
 * Server Action: Obter roasts com paginação
 */
export async function getRoastsAction(limit = 20, offset = 0) {
  try {
    const data = await getRoasts(limit, offset);
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao obter roasts:", error);
    return { success: false, error: "Falha ao obter roasts" };
  }
}

/**
 * Server Action: Obter leaderboard
 */
export async function getLeaderboardAction(limit = 10) {
  try {
    const data = await getLeaderboard(limit);
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao obter leaderboard:", error);
    return { success: false, error: "Falha ao obter leaderboard" };
  }
}

/**
 * Server Action: Obter roasts por linguagem
 */
export async function getRoastsByLanguageAction(languageId: string, limit = 20, offset = 0) {
  try {
    const data = await getRoastsByLanguage(languageId, limit, offset);
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao obter roasts por linguagem:", error);
    return {
      success: false,
      error: "Falha ao obter roasts por linguagem",
    };
  }
}

/**
 * Server Action: Adicionar comentário em um roast
 */
export async function addCommentAction(roastId: string, userId: string, content: string) {
  try {
    const comment = await createComment(roastId, userId, content);
    return { success: true, data: comment };
  } catch (error) {
    console.error("Erro ao adicionar comentário:", error);
    return { success: false, error: "Falha ao adicionar comentário" };
  }
}

/**
 * Server Action: Atualizar comentário
 */
export async function updateCommentAction(commentId: string, content: string) {
  try {
    const comment = await updateComment(commentId, content);
    return { success: true, data: comment };
  } catch (error) {
    console.error("Erro ao atualizar comentário:", error);
    return { success: false, error: "Falha ao atualizar comentário" };
  }
}

/**
 * Server Action: Deletar comentário
 */
export async function deleteCommentAction(commentId: string) {
  try {
    const result = await deleteComment(commentId);
    return { success: !!result };
  } catch (error) {
    console.error("Erro ao deletar comentário:", error);
    return { success: false, error: "Falha ao deletar comentário" };
  }
}

/**
 * Server Action: Dar like em comentário
 */
export async function likeCommentAction(commentId: string) {
  try {
    const result = await incrementCommentLikes(commentId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro ao dar like:", error);
    return { success: false, error: "Falha ao dar like" };
  }
}

/**
 * Server Action: Remover like de comentário
 */
export async function unlikeCommentAction(commentId: string) {
  try {
    const result = await decrementCommentLikes(commentId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro ao remover like:", error);
    return { success: false, error: "Falha ao remover like" };
  }
}

/**
 * Server Action: Alternar favorito
 */
export async function toggleFavoriteAction(roastId: string, userId: string) {
  try {
    const result = await toggleFavorite(roastId, userId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro ao alternar favorito:", error);
    return { success: false, error: "Falha ao alternar favorito" };
  }
}

/**
 * Server Action: Verificar se está favoritado
 */
export async function checkFavoritedAction(roastId: string, userId: string) {
  try {
    const favorited = await isFavorited(roastId, userId);
    return { success: true, data: { favorited } };
  } catch (error) {
    console.error("Erro ao verificar favorito:", error);
    return { success: false, error: "Falha ao verificar favorito" };
  }
}

/**
 * Server Action: Criar issue em um roast
 */
export async function createIssueAction(
  roastId: string,
  title: string,
  description: string,
  codeExample: string | null,
  severity: "critical" | "warning" | "info",
  category: string,
  lineNumber: number | null
) {
  try {
    const issue = await createIssue(
      roastId,
      title,
      description,
      codeExample,
      severity,
      category,
      lineNumber
    );
    return { success: true, data: issue };
  } catch (error) {
    console.error("Erro ao criar issue:", error);
    return { success: false, error: "Falha ao criar issue" };
  }
}

/**
 * Server Action: Criar múltiplas issues
 */
export async function createIssuesAction(
  roastId: string,
  issues: Array<{
    title: string;
    description: string;
    codeExample?: string | null;
    severity: "critical" | "warning" | "info";
    category: string;
    lineNumber?: number | null;
  }>
) {
  try {
    const createdIssues = await createIssues(roastId, issues);
    return { success: true, data: createdIssues };
  } catch (error) {
    console.error("Erro ao criar issues:", error);
    return { success: false, error: "Falha ao criar issues" };
  }
}
