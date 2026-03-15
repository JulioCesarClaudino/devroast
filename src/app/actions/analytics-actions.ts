"use server";

import {
  getFeaturedRoastsCount,
  getGlobalStats,
  getIssueStats,
  getMostCommonCategories,
  getMostFavoritedRoasts,
  getMostViewedRoasts,
  getRoastsByDate,
  getScoreDistribution,
  getTopRatedRoasts,
  getTrendingRoasts,
  getUserEngagementMetrics,
  getVerdictDistribution,
} from "@/lib/db/analytics-queries";

/**
 * Server Action: Obter estatísticas globais
 */
export async function getGlobalStatsAction() {
  try {
    const stats = await getGlobalStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("Erro ao obter estatísticas globais:", error);
    return {
      success: false,
      error: "Falha ao obter estatísticas globais",
    };
  }
}

/**
 * Server Action: Obter distribuição de scores
 */
export async function getScoreDistributionAction() {
  try {
    const distribution = await getScoreDistribution();
    return { success: true, data: distribution };
  } catch (error) {
    console.error("Erro ao obter distribuição de scores:", error);
    return {
      success: false,
      error: "Falha ao obter distribuição de scores",
    };
  }
}

/**
 * Server Action: Obter distribuição de verdicts
 */
export async function getVerdictDistributionAction() {
  try {
    const distribution = await getVerdictDistribution();
    return { success: true, data: distribution };
  } catch (error) {
    console.error("Erro ao obter distribuição de verdicts:", error);
    return {
      success: false,
      error: "Falha ao obter distribuição de verdicts",
    };
  }
}

/**
 * Server Action: Obter roasts em tendência
 */
export async function getTrendingRoastsAction(limit = 10) {
  try {
    const roasts = await getTrendingRoasts(limit);
    return { success: true, data: roasts };
  } catch (error) {
    console.error("Erro ao obter roasts em tendência:", error);
    return {
      success: false,
      error: "Falha ao obter roasts em tendência",
    };
  }
}

/**
 * Server Action: Obter roasts melhor classificados
 */
export async function getTopRatedRoastsAction(limit = 10) {
  try {
    const roasts = await getTopRatedRoasts(limit);
    return { success: true, data: roasts };
  } catch (error) {
    console.error("Erro ao obter roasts melhor classificados:", error);
    return {
      success: false,
      error: "Falha ao obter roasts melhor classificados",
    };
  }
}

/**
 * Server Action: Obter roasts mais visualizados
 */
export async function getMostViewedRoastsAction(limit = 10) {
  try {
    const roasts = await getMostViewedRoasts(limit);
    return { success: true, data: roasts };
  } catch (error) {
    console.error("Erro ao obter roasts mais visualizados:", error);
    return {
      success: false,
      error: "Falha ao obter roasts mais visualizados",
    };
  }
}

/**
 * Server Action: Obter roasts mais favoritados
 */
export async function getMostFavoritedRoastsAction(limit = 10) {
  try {
    const roasts = await getMostFavoritedRoasts(limit);
    return { success: true, data: roasts };
  } catch (error) {
    console.error("Erro ao obter roasts mais favoritados:", error);
    return {
      success: false,
      error: "Falha ao obter roasts mais favoritados",
    };
  }
}

/**
 * Server Action: Obter roasts por data
 */
export async function getRoastsByDateAction(days = 30) {
  try {
    const data = await getRoastsByDate(days);
    return { success: true, data };
  } catch (error) {
    console.error("Erro ao obter roasts por data:", error);
    return {
      success: false,
      error: "Falha ao obter roasts por data",
    };
  }
}

/**
 * Server Action: Obter estatísticas de issues
 */
export async function getIssueStatsAction() {
  try {
    const stats = await getIssueStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("Erro ao obter estatísticas de issues:", error);
    return {
      success: false,
      error: "Falha ao obter estatísticas de issues",
    };
  }
}

/**
 * Server Action: Obter categorias mais comuns
 */
export async function getMostCommonCategoriesAction(limit = 10) {
  try {
    const categories = await getMostCommonCategories(limit);
    return { success: true, data: categories };
  } catch (error) {
    console.error("Erro ao obter categorias mais comuns:", error);
    return {
      success: false,
      error: "Falha ao obter categorias mais comuns",
    };
  }
}

/**
 * Server Action: Obter contagem de roasts em destaque
 */
export async function getFeaturedRoastsCountAction() {
  try {
    const count = await getFeaturedRoastsCount();
    return { success: true, data: { count } };
  } catch (error) {
    console.error("Erro ao obter contagem de roasts em destaque:", error);
    return {
      success: false,
      error: "Falha ao obter contagem de roasts em destaque",
    };
  }
}

/**
 * Server Action: Obter métricas de engajamento do usuário
 */
export async function getUserEngagementMetricsAction() {
  try {
    const metrics = await getUserEngagementMetrics();
    return { success: true, data: metrics };
  } catch (error) {
    console.error("Erro ao obter métricas de engajamento:", error);
    return {
      success: false,
      error: "Falha ao obter métricas de engajamento",
    };
  }
}
