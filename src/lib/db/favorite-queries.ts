"use server";

import { sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db/client";

/**
 * Check if user has favorited a roast
 */
export async function isFavorited(roastId: string, userId: string) {
  const result = await db.execute(sql`
    SELECT id
    FROM roast_favorites
    WHERE roast_id = ${roastId} AND user_id = ${userId}
    LIMIT 1
  `);

  return result.rows.length > 0;
}

/**
 * Toggle favorite on a roast
 */
export async function toggleFavorite(roastId: string, userId: string) {
  const now = new Date();

  // Check if already favorited
  const existing = await isFavorited(roastId, userId);

  if (existing) {
    // Remove favorite
    await db.execute(sql`
      DELETE FROM roast_favorites
      WHERE roast_id = ${roastId} AND user_id = ${userId}
    `);

    // Decrement roast favorites count
    await db.execute(sql`
      UPDATE roasts
      SET favorites_count = GREATEST(favorites_count - 1, 0), updated_at = ${now}
      WHERE id = ${roastId}
    `);

    return { favorited: false };
  } else {
    // Add favorite
    const favoriteId = uuidv4();

    await db.execute(sql`
      INSERT INTO roast_favorites (id, roast_id, user_id, created_at)
      VALUES (${favoriteId}, ${roastId}, ${userId}, ${now})
      ON CONFLICT (roast_id, user_id) DO NOTHING
    `);

    // Increment roast favorites count
    await db.execute(sql`
      UPDATE roasts
      SET favorites_count = favorites_count + 1, updated_at = ${now}
      WHERE id = ${roastId}
    `);

    return { favorited: true };
  }
}

/**
 * Add roast to favorites
 */
export async function addFavorite(roastId: string, userId: string) {
  const now = new Date();
  const isAlreadyFavorited = await isFavorited(roastId, userId);

  if (isAlreadyFavorited) {
    return { success: false, message: "Already favorited" };
  }

  const favoriteId = uuidv4();

  const result = await db.execute(sql`
    INSERT INTO roast_favorites (id, roast_id, user_id, created_at)
    VALUES (${favoriteId}, ${roastId}, ${userId}, ${now})
    RETURNING id, roast_id as roastId, user_id as userId, created_at as createdAt
  `);

  // Increment roast favorites count
  await db.execute(sql`
    UPDATE roasts
    SET favorites_count = favorites_count + 1, updated_at = ${now}
    WHERE id = ${roastId}
  `);

  return { success: true, data: result.rows[0] };
}

/**
 * Remove roast from favorites
 */
export async function removeFavorite(roastId: string, userId: string) {
  const now = new Date();

  const result = await db.execute(sql`
    DELETE FROM roast_favorites
    WHERE roast_id = ${roastId} AND user_id = ${userId}
    RETURNING id
  `);

  if (result.rows.length === 0) {
    return { success: false, message: "Not favorited" };
  }

  // Decrement roast favorites count
  await db.execute(sql`
    UPDATE roasts
    SET favorites_count = GREATEST(favorites_count - 1, 0), updated_at = ${now}
    WHERE id = ${roastId}
  `);

  return { success: true };
}

/**
 * Get user's favorite roasts count
 */
export async function getUserFavoritesCount(userId: string) {
  const result = await db.execute(sql`
    SELECT COUNT(*) as count
    FROM roast_favorites
    WHERE user_id = ${userId}
  `);

  return parseInt((result.rows[0] as any)?.count as string) || 0;
}

/**
 * Get users who favorited a roast
 */
export async function getRoastFavoritedBy(roastId: string, limit = 10) {
  const result = await db.execute(sql`
    SELECT
      u.id,
      u.username,
      u.email
    FROM roast_favorites rf
    LEFT JOIN users u ON rf.user_id = u.id
    WHERE rf.roast_id = ${roastId}
    ORDER BY rf.created_at DESC
    LIMIT ${limit}
  `);

  return result.rows;
}
