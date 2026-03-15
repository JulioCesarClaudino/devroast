"use server";

import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  getUserFavorites,
  getUserRecentRoasts,
  getUserRoastStats,
  updateUserEmail,
  updateUsername,
} from "@/lib/db/user-queries";

/**
 * Server Action: Criar novo usuário
 */
export async function createUserAction(username: string, email: string) {
  try {
    // Verificar se username já existe
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return { success: false, error: "Username já existe" };
    }

    // Verificar se email já existe
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return { success: false, error: "Email já está registrado" };
    }

    const user = await createUser(username, email);
    return { success: true, data: user };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { success: false, error: "Falha ao criar usuário" };
  }
}

/**
 * Server Action: Obter usuário por ID
 */
export async function getUserAction(userId: string) {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }
    return { success: true, data: user };
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return { success: false, error: "Falha ao obter usuário" };
  }
}

/**
 * Server Action: Obter usuário por username
 */
export async function getUserByUsernameAction(username: string) {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }
    return { success: true, data: user };
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return { success: false, error: "Falha ao obter usuário" };
  }
}

/**
 * Server Action: Atualizar email do usuário
 */
export async function updateUserEmailAction(userId: string, email: string) {
  try {
    // Verificar se email já está em uso
    const existingEmail = await getUserByEmail(email);
    if (existingEmail && existingEmail.id !== userId) {
      return { success: false, error: "Email já está em uso" };
    }

    const user = await updateUserEmail(userId, email);
    return { success: true, data: user };
  } catch (error) {
    console.error("Erro ao atualizar email:", error);
    return { success: false, error: "Falha ao atualizar email" };
  }
}

/**
 * Server Action: Atualizar username
 */
export async function updateUsernameAction(userId: string, username: string) {
  try {
    // Verificar se username já existe
    const existingUser = await getUserByUsername(username);
    if (existingUser && existingUser.id !== userId) {
      return { success: false, error: "Username já existe" };
    }

    const user = await updateUsername(userId, username);
    return { success: true, data: user };
  } catch (error) {
    console.error("Erro ao atualizar username:", error);
    return { success: false, error: "Falha ao atualizar username" };
  }
}

/**
 * Server Action: Obter estatísticas de roasts do usuário
 */
export async function getUserStatsAction(userId: string) {
  try {
    const stats = await getUserRoastStats(userId);
    return { success: true, data: stats };
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return { success: false, error: "Falha ao obter estatísticas" };
  }
}

/**
 * Server Action: Obter roasts recentes do usuário
 */
export async function getUserRecentRoastsAction(userId: string, limit = 10) {
  try {
    const roasts = await getUserRecentRoasts(userId, limit);
    return { success: true, data: roasts };
  } catch (error) {
    console.error("Erro ao obter roasts recentes:", error);
    return { success: false, error: "Falha ao obter roasts recentes" };
  }
}

/**
 * Server Action: Obter favoritos do usuário
 */
export async function getUserFavoritesAction(userId: string, limit = 20, offset = 0) {
  try {
    const favorites = await getUserFavorites(userId, limit, offset);
    return { success: true, data: favorites };
  } catch (error) {
    console.error("Erro ao obter favoritos:", error);
    return { success: false, error: "Falha ao obter favoritos" };
  }
}

/**
 * Server Action: Deletar conta do usuário
 */
export async function deleteUserAction(userId: string) {
  try {
    const result = await deleteUser(userId);
    return { success: !!result };
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return { success: false, error: "Falha ao deletar usuário" };
  }
}
